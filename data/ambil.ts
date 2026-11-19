import type { Event } from "@/data/events";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Pesanan } from "@/data/pesanan";

export async function ambilEvents(): Promise<Event[]> {
    const { data, error } = await supabase.from("events").select("*").order("tanggal");
    if (error) throw new Error("Gagal memuat event: " + error.message);
    return data as Event[];
}

export async function ambilEvent(id: number): Promise<Event | null> {
  //Isi URL bisa apa saja (misalnya /event/abc). periksa dulu sebelum bertanya ke database
  if(!Number.isInteger(id)) return null;
  const {data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if(error) throw new Error("Gagal memuat event: " + error.message);
  return data as Event | null;
}

export async function ambilTerkait(event: Event): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("kategori", event.kategori)
    .neq("id", event.id)
    .order("tanggal")
  if (error) throw new Error(`Gagal memuat event: ${error.message}`);
  return data as Event[];
}

//pesanan berisi nama dan email, jadi dibaca menggunakan kunci rahasia (hanya di server)
export async function hitungPesanan(
  eventId: number,
): Promise<{ pesanan: number; tiket: number }> {
  const { data, error } = await supabaseAdmin
    .from("pesanan")
    .select("jumlah")
    .eq("event_id", eventId);
  if (error) throw new Error("Gagal menghitung pesanan: " + error.message);

  const tiket = data.reduce((total, p) => total + p.jumlah, 0);
  return { pesanan: data.length, tiket };
}

export async function ambilPesanan(): Promise<Pesanan[]> {
  const {data, error} = await supabaseAdmin
  .from("pesanan")
  .select("*, events(judul)")
  .order("nomor", {ascending: false });
  if(error) throw new Error("Gagal memuat pesanan: " + error.message);
  return data as Pesanan[];
  
}

//.eq("id", id) artinya hanya ambil baris yang kolom id-nya sama dengan nilai id
//.neq("id", event.id) artinya ambil baris yang kolom id-nya tidak sama dengan event.id
//{ count: "exact", head: true } mengambil hanya jumlahnya. 
// count: "exact" meminta jumlah baris yang tepat, 
// dan head: true berarti isi barisnya tidak dikirim. Hasilnya cuma angka, yang dibaca lewat count.