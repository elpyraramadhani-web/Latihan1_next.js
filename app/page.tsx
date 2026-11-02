import Link from "next/link";

export default function Beranda() {
  return (
    <section className="py-12 text-center">
      <h1 className = "text-4xl font-bold ">Temukan event baru seru di sekolahmu</h1>
      <p className="mt-4 text-slate-600">
        Workshop, lomba, dan bazar. Pesan tiketnya di sini.
      </p>
      <Link
        href="/events"
        className="mt-6 inline-block rounded bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
      >
        Lihat semua event
      </Link>
    </section>
  );
}