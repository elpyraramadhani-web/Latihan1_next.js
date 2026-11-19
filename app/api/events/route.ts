import { ambilEvents } from "@/data/ambil";

export async function GET() {
  const events = await ambilEvents();
  return Response.json(events);
}