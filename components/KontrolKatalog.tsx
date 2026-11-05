type Props = {
  cari: string;
  onCari: (nilai: string) => void;
  kategori: string;
  onKategori: (nilai: string) => void;
  daftarKategori: string[];
  urut: string;
  onUrut: (nilai: string) => void;
  hanyaTiket: boolean;
  onHanyaTiket: (nilai: boolean) => void;
  hargaMaks: string;
  onHargaMaks: (nilai: string) => void;
};

export default function KontrolKatalog({
  cari, onCari,
  kategori, onKategori, daftarKategori,
  urut, onUrut,
  hanyaTiket, onHanyaTiket,
  hargaMaks, onHargaMaks,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <input
        value={cari}
        onChange={(e) => onCari(e.target.value)}
        placeholder="Cari event..."
        className="rounded border bg-white px-3 py-2"
      />
      <select
        value={kategori}
        onChange={(e) => onKategori(e.target.value)}
        className="rounded border bg-white px-3 py-2"
      >
        {daftarKategori.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <select
        value={urut}
        onChange={(e) => onUrut(e.target.value)}
        className="rounded border bg-white px-3 py-2"
      >
        <option value="tanggal">Tanggal terdekat</option>
        <option value="murah">Harga termurah</option>
        <option value="mahal">Harga termahal</option>
        <option value="nama">Nama A-Z</option>
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={hanyaTiket}
          onChange={(e) => onHanyaTiket(e.target.checked)}
        />
        Hanya yang masih ada tiket
      </label>
      <input
        type="number"
        min="0"
        value={hargaMaks}
        onChange={(e) => onHargaMaks(e.target.value)}
        placeholder="Harga maksimal"
        className="rounded border bg-white px-3 py-2"
      />
    </div>
  );
}