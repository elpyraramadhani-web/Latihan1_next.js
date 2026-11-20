"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NAMA_COOKIE, UMUR_SESI, buatToken } from "@/lib/sesi";
import { timingSafeEqual, createHash } from "node:crypto";

function samaAman(a: string, b: string) {
  // hash dulu supaya panjangnya sama (timingSafeEqual butuh panjang sama)
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export type HasilMasuk = { pesan: string };

const BATAS = 5;
const KUNCI = "gagal_login"; // isinya: "jumlah.waktuMulaiTerkunci"

export async function masuk(
  _sebelum: HasilMasuk,
  formData: FormData,
): Promise<HasilMasuk> {
  const sandi = String(formData.get("sandi") ?? "");
  const dari = String(formData.get("dari") ?? "");
  const toples = await cookies();

  // baca hitungan percobaan gagal
  const [jumlahTeks, kunciTeks] = (toples.get(KUNCI)?.value ?? "0.0").split(".");
  const jumlah = Number(jumlahTeks) || 0;
  const terkunciSampai = Number(kunciTeks) || 0;

  if (terkunciSampai > Date.now()) {
    const detik = Math.ceil((terkunciSampai - Date.now()) / 1000);
    return { pesan: `Terlalu banyak percobaan. Coba lagi dalam ${detik} detik.` };
  }

  if (!samaAman(sandi, process.env.ADMIN_PASSWORD ?? "")) {
    const baru = jumlah + 1;
    const sampai = baru >= BATAS ? Date.now() + 60_000 : 0;
    toples.set(KUNCI, `${baru >= BATAS ? 0 : baru}.${sampai}`, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 10,
    });
    return { pesan: "Kata sandi salah." };
  }

  toples.delete(KUNCI);
  toples.set(NAMA_COOKIE, await buatToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_SESI,
  });

  redirect(dari.startsWith("/admin") ? dari : "/admin");
}

export async function keluar() {
  (await cookies()).delete(NAMA_COOKIE);
  redirect("/login");
}