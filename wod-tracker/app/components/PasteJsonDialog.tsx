"use client";

import { useState } from "react";

interface Exercise {
  name: string;
  reps?: number;
  weight?: string;
  distance?: string;
  time?: string;
  notes?: string;
}

interface JsonData {
  title: string;
  type: string;
  exercises: Exercise[];
  description?: string;
}

interface PasteJsonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: JsonData) => void;
  loading: boolean;
}

export function PasteJsonDialog({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: PasteJsonDialogProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    try {
      setError("");
      const data = JSON.parse(jsonText);

      // Validar campos requeridos
      if (!data.title) {
        setError("Falta el campo 'title'");
        return;
      }
      if (!data.type) {
        setError("Falta el campo 'type'");
        return;
      }
      if (!Array.isArray(data.exercises) || data.exercises.length === 0) {
        setError("'exercises' debe ser un array no vacío");
        return;
      }

      onConfirm(data);
      setJsonText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON inválido");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">Pegar JSON del WOD</h2>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
            <p className="font-semibold text-blue-900 mb-2">
              📋 Estructura esperada:
            </p>
            <code className="text-blue-800 block whitespace-pre-wrap">
              {`{
  "title": "nombre del WOD",
  "type": "FOR_TIME",
  "description": "descripción",
  "exercises": [
    {
      "name": "Barbell Thrusters",
      "reps": 21,
      "weight": "65 lb"
    }
  ]
}`}
            </code>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">JSON</label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Pega aquí el JSON del WOD..."
              className="w-full px-3 py-2 border rounded-lg font-mono text-sm h-32"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              ❌ {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !jsonText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
