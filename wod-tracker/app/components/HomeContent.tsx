"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { WodCalendar } from "@/app/components/WodCalendar";
import Link from "next/link";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [wodsInMonth, setWodsInMonth] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState("");
  const [wod, setWod] = useState<any>(null);
  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dateParam = searchParams.get("date");
    const today = new Date().toISOString().split("T")[0];
    const initialDate = dateParam || today;
    setSelectedDate(initialDate);
    fetchWodsInMonth(initialDate);
    fetchWodDetails(initialDate);
  }, [searchParams]);

  const fetchWodsInMonth = async (date: string) => {
    try {
      const month = date.substring(0, 7);
      const response = await fetch(`/api/wod/get?month=${month}`);
      const data = await response.json();
      setWodsInMonth(new Set(data.dates));
    } catch (error) {
      console.error("Error fetching month WODs:", error);
    }
  };

  const fetchWodDetails = async (date: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/wod/get?date=${date}`);
      const data = await response.json();
      setWod(data.wod);
      setDetails(data.details || []);
    } catch (error) {
      console.error("Error fetching WOD details:", error);
      setWod(null);
      setDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    router.push(`/?date=${date}`);
    fetchWodDetails(date);
  };

  const today = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === today;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">📅 WOD Tracker</h1>
          <Link
            href="/admin"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            ⚙️ Admin
          </Link>
        </div>

        {/* Calendar */}
        <div className="mb-8">
          <WodCalendar
            wodsInMonth={wodsInMonth}
            onDateSelect={handleDateSelect}
          />
        </div>

        {/* WOD Details */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {isToday
                ? "🎯 WOD de Hoy"
                : `📋 WOD - ${selectedDate}`}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando...</div>
          ) : wod ? (
            <div className="space-y-6">
              <div className="border-b pb-4 space-y-2">
                <h3 className="text-xl font-bold">{wod.title}</h3>
                <p className="text-gray-600">{wod.description}</p>
              </div>

              {/* Exercises */}
              <div>
                <h4 className="font-bold mb-3">Ejercicios (RX):</h4>
                <div className="space-y-2">
                  {details
                    .filter((d) => d.difficulty === "RX")
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((exercise, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-3 rounded border space-y-1"
                      >
                        <p className="font-semibold">{exercise.exercise_name}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          {exercise.reps && <p>Reps: {exercise.reps}</p>}
                          {exercise.weight && <p>Peso: {exercise.weight}</p>}
                          {exercise.distance && <p>Distancia: {exercise.distance}</p>}
                          {exercise.time_seconds && (
                            <p>Tiempo: {exercise.time_seconds}s</p>
                          )}
                          {exercise.notes && <p>Notas: {exercise.notes}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              📭 No hay WOD para este día
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeContent;
