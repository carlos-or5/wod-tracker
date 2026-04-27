"use client";

import { useState } from "react";
import { PasteJsonDialog } from "@/app/components/PasteJsonDialog";
import { useRouter } from "next/navigation";

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

export default function CreateWodPage() {
  const router = useRouter();
  const [date, setDate] = useState(tomorrow);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEndurance, setIsEndurance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wodId, setWodId] = useState<string | null>(null);
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const createEmptyWod = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/wod/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          title: title || "Sin título",
          description,
          isEndurance,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setWodId(result.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error creating WOD");
    } finally {
      setLoading(false);
    }
  };

  const handleJsonPasted = (jsonData: any) => {
    setAnalysis(jsonData);
    setShowJsonDialog(false);
  };

  const handleSaveWod = async () => {
    if (!analysis) return;

    try {
      setLoading(true);
      const response = await fetch("/api/wod/confirm-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wodId: wodId,
          exercises: analysis.exercises,
          title: title || analysis.title,
          description: description || analysis.description,
          type: analysis.type,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      router.push("/");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error saving WOD");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Crear WOD</h1>

        {!wodId ? (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Título (opcional)
              </label>
              <input
                type="text"
                placeholder="ej: Legs Day, Hero WOD..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Descripción (opcional)
              </label>
              <textarea
                placeholder="ej: Enfoque en piernas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg h-24"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="endurance"
                checked={isEndurance}
                onChange={(e) => setIsEndurance(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="endurance" className="font-semibold">
                Es un WOD de Endurance
              </label>
            </div>

            <button
              onClick={createEmptyWod}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg"
            >
              {loading ? "Creando..." : "Siguiente"}
            </button>
          </div>
        ) : !analysis ? (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold mb-6">Pegar JSON del WOD</h2>

            <button
              onClick={() => setShowJsonDialog(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg text-lg"
            >
              📋 Pegar JSON
            </button>

            <button
              onClick={() => setWodId(null)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg"
            >
              ← Volver
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Confirmar WOD</h2>

            <div className="space-y-2">
              <p>
                <strong>Título:</strong> {title || analysis.title}
              </p>
              <p>
                <strong>Tipo:</strong> {analysis.type}
              </p>
              <p>
                <strong>Descripción:</strong> {description || analysis.description}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Ejercicios ({analysis.exercises.length}):</h3>
              <div className="space-y-2">
                {analysis.exercises.map((ex: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-3 rounded border text-sm space-y-1"
                  >
                    <p className="font-semibold">{ex.name}</p>
                    {ex.reps && <p>Reps: {ex.reps}</p>}
                    {ex.weight && <p>Peso: {ex.weight}</p>}
                    {ex.distance && <p>Distancia: {ex.distance}</p>}
                    {ex.time && <p>Tiempo: {ex.time}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setAnalysis(null);
                  setShowJsonDialog(true);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg"
              >
                ← Editar
              </button>
              <button
                onClick={handleSaveWod}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg"
              >
                {loading ? "Guardando..." : "Guardar WOD"}
              </button>
            </div>
          </div>
        )}

        <PasteJsonDialog
          isOpen={showJsonDialog}
          onClose={() => setShowJsonDialog(false)}
          onConfirm={handleJsonPasted}
          loading={loading}
        />
      </div>
    </div>
  );
}
