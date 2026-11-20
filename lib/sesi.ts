import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const NAMA_COOKIE = "admin_sesi";
export const UMUR_SESI = 60 * 60 * 8; //8 jam dalam detik

//tanda tangan: hanya server yang tahu SESSIN_SECRET, jadi cookie tidak bisa dipalsukan
async function tandatangan(isi: string) {
    const kunci = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(process.env.SESSION_SECRET!),
        {name: "HMAC", hash: "SHA-256"},
        false,
        ["sign"]
    );
    const hasil = await crypto.subtle.sign("HMAC", kunci, new TextEncoder().encode(isi));
    return Array.from(new Uint8Array(hasil))
    .map((b)=> b.toString(16).padStart(2, "0"))
    .join("");
}

export async function buatToken() {
    const habis = String(Date.now() + UMUR_SESI * 1000);
    return `${habis}.${await tandatangan(habis)}`;
}

export async function tokenSah(token: string | undefined) {
    if (!token) return false;
    const [habis, tanda] = token.split(".");
    if(!habis || !tanda ) return false;
    if(!(Number(habis) > Date.now())) return false; //sudah kadaluwarsa atay bukan angka
    return tanda === (await tandatangan(habis))
}

//dipanggil di awal halaman dan server action admin. proxy.ts saja tidak cyukup
//server action bisa di panggil langsung jadi harus memekeriksa sendiri
export async function pastikanAdmin() {
    const token = (await cookies()).get(NAMA_COOKIE)?.value;
    if(!(await tokenSah(token))) redirect("/login")
}