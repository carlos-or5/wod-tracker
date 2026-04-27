"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface WodDetailProps {
  wodId: string;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  reps?: number;
  weight?: string;
  distance?: string;
  notes?: string;
}

interface Variant {
  id: string;
  difficulty: string;
  exercises: Exercise[];
}

interface Block {
  id: string;
  type: string;
  wodType: string;
  duration: number;
  variants: Variant[];
}

interface WodDetail {
  id: string;
  date: string;
  title: string;
  description: string;
  is_endurance: boolean;
  image_url: string;
  blocks: Block[];
}

export function WodDetail({ wodId }: WodDetailProps) {
  const [wod, setWod] = useState<WodDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("RX");

  useEffect(() => {
    const fetchWod = async () => {
      try {
        const response = await fetch(`/api/wod/${wodId}`);
        const data = await response.json();
        setWod(data);
      } catch (error) {
        console.error("Error fetching WOD:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWod();
  }, [wodId]);

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (!wod) {
    return (
      <div className="text-center py-8 text-red-600">WOD no encontrado</div>
    );
  }

  const primaryBlock = wod.blocks?.[0];
  const selectedVariant = primaryBlock?.variants?.find(
    (v) => v.difficulty === selectedDifficulty,
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{wod.title || "WOD"}</h1>
            <p className="text-blue-100">
              {new Date(wod.date).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {wod.is_endurance && (
            <span className="bg-red-500 px-4 py-2 rounded-full font-semibold">
              ENDURANCE
            </span>
          )}
        </div>
      </div>

      {/* Descripción */}
      {wod.description && (
        <div className="px-6 py-4 bg-gray-50 border-b">
          <p className="text-gray-700">{wod.description}</p>
        </div>
      )}

      {/* Imagen */}
      {wod.image_url && (
        <div className="relative w-full h-80">
          <Image
            src={wod.image_url}
            alt={wod.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Selectores de dificultad */}
      {primaryBlock && (
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold mb-3">Nivel de dificultad:</h2>
          <div className="flex gap-2 flex-wrap">
            {primaryBlock.variants?.map((variant) => (
              <button
                key={variant.difficulty}
                onClick={() => setSelectedDifficulty(variant.difficulty)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedDifficulty === variant.difficulty
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {variant.difficulty}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ejercicios */}
      {selectedVariant && selectedVariant.exercises?.length > 0 && (
        <div className="px-6 py-6">
          <h2 className="text-2xl font-bold mb-4">Ejercicios</h2>
          <div className="space-y-4">
            {selectedVariant.exercises.map((exercise, idx) => (
              <div
                key={exercise.id}
                className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold mr-2">
                      {idx + 1}
                    </span>
                    <h3 className="inline text-lg font-bold text-gray-900">
                      {exercise.name}
                    </h3>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {exercise.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {exercise.reps && (
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">
                        Repeticiones
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {exercise.reps}
                      </p>
                    </div>
                  )}
                  {exercise.weight && (
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">
                        Peso
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {exercise.weight}
                      </p>
                    </div>
                  )}
                  {exercise.distance && (
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">
                        Distancia
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {exercise.distance}
                      </p>
                    </div>
                  )}
                </div>

                {exercise.notes && (
                  <p className="text-sm text-gray-600 mt-3 italic">
                    📝 {exercise.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
