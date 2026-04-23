import Link from "next/link";
import { getWods } from "@/src/services/wod.service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const wods = await getWods();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">WOD Tracker</h1>

        <Link href="/create">
          <button className="bg-black text-white px-4 py-2 rounded-xl">
            + Crear WOD
          </button>
        </Link>
      </div>

      <div className="grid gap-3">
        {wods.map((w: any) => (
          <div key={w.id} className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-sm text-gray-500">
              {new Date(w.date).toLocaleDateString()}
            </div>
            <div className="font-medium">{w.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
