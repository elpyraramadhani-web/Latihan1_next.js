import Link from "next/link";
import { alamatHalaman, type Saringan } from "@/data/saring";

export default function Halaman({
  s,
  hal,
  jumlah,
}: {
  s: Saringan;
  hal: number;
  jumlah: number;
}) {
  // hanya satu halaman: tidak menampilkan apa pun
  if (jumlah <= 1) return null;

  const nomor = Array.from({ length: jumlah }, (_, i) => i + 1);
  const dasar = "rounded border px-3 py-1 hover:bg-slate-100";

  return (
    <nav className="mt-6 flex flex-wrap items-center gap-2">
      {hal > 1 && (
        <Link href={alamatHalaman(s, hal - 1)} className={dasar}>
          « Sebelumnya
        </Link>
      )}

      {nomor.map((n) => (
        <Link
          key={n}
          href={alamatHalaman(s, n)}
          aria-current={n === hal ? "page" : undefined}
          className={
            n === hal
              ? "rounded border border-blue-600 bg-blue-600 px-3 py-1 font-bold text-white"
              : dasar
          }
        >
          {n}
        </Link>
      ))}

      {hal < jumlah && (
        <Link href={alamatHalaman(s, hal + 1)} className={dasar}>
          Berikutnya »
        </Link>
      )}
    </nav>
  );
}