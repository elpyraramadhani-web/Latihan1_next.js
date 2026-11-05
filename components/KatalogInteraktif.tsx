"use client";
import { useState, useEffect } from "react";
import {rupiah, type Event } from "@/data/events";
import KartuEvent from "./KartuEvent";
import KontrolKatalog from "./KontrolKatalog";

export default function KatalogInteraktif({ events }: { events: Event[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("tanggal");
  const [jumlah, setJumlah] = useState(4);
  const [hanyaTiket, setHanyaTiket] = useState(false);
  const [hargaMaks, setHargaMaks] = useState("");

  useEffect(() => {
    const tersimpan = localStorage.getItem("urut");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tersimpan) setUrut(tersimpan);
  }, []);

  const ubahCari = (v: string) => { setCari(v); setJumlah(4); };
  const ubahKategori = (v: string) => { setKategori(v); setJumlah(4); };
  const ubahUrut = (v: string) => {
    setUrut(v);
    setJumlah(4);
    localStorage.setItem("urut", v);
  };
  const ubahHanyaTiket = (v: boolean) => { setHanyaTiket(v); setJumlah(4); };
  const ubahHargaMaks = (v: string) => { setHargaMaks(v); setJumlah(4); };


  const daftarKategori = ["Semua", ...new Set(events.map((e) => e.kategori))];
  const hasil = events.filter(
    (e) =>
      e.judul.toLowerCase().includes(cari.toLowerCase()) &&
      (kategori === "Semua" || e.kategori === kategori) &&
      (!hanyaTiket || e.kuota - e.terisi > 0) &&
      (hargaMaks === "" || e.harga <= Number(hargaMaks))
  );

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") {
      return a.harga - b.harga;
    }
    if (urut === "mahal") {
      return b.harga - a.harga;
    }
    if (urut === "nama") {
      return a.judul.localeCompare(b.judul);
    }
    return a.tanggal.localeCompare(b.tanggal);
  });


  const totalHarga = tersusun.reduce((total, e) => total + e.harga, 0);
  const totalSisa = tersusun.reduce((total, e) => total + (e.kuota - e.terisi), 0);
  const rataHarga =
    tersusun.length > 0 ? Math.round(totalHarga / tersusun.length) : 0;

  const tampil = tersusun.slice(0, jumlah);
  const sisaKartu = tersusun.length - tampil.length;

    return (
    <div>
      <KontrolKatalog
        cari={cari} onCari={ubahCari}
        kategori={kategori} onKategori={ubahKategori}
        daftarKategori={daftarKategori}
        urut={urut} onUrut={ubahUrut}
        hanyaTiket={hanyaTiket} onHanyaTiket={ubahHanyaTiket}
        hargaMaks={hargaMaks} onHargaMaks={ubahHargaMaks}
      />

      <p className="mb-1 text-sm text-slate-500">
        {tersusun.length} event ditemukan
      </p>
      <p className="mb-3 text-sm text-slate-500">
        Rata-rata harga {rupiah(rataHarga)} · Total sisa tiket {totalSisa}
      </p>

      {tersusun.length === 0 ? (
        <p className="text-slate-500">Tidak ada event yang cocok.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tampil.map((e) => (
              <KartuEvent key={e.id} event={e} />
            ))}
          </div>
          {sisaKartu > 0 && (
            <button
              onClick={() => setJumlah(jumlah + 4)}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Tampilkan lagi ({sisaKartu} lagi)
            </button>
          )}
        </>
      )}
    </div>
  );
}