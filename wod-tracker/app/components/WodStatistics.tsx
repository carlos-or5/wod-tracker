"use client";

import { useEffect, useState } from "react";

interface ExerciseStats {
  name: string;
  count: number;
  percentage: number;
}

interface StatsFilterProps {
  period: "week" | "month" | "year";
  startDate: string;
  endDate: string;
}

export function WodStatistics() {
  const [stats, setStats] = useState<ExerciseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatsFilterProps>({
    period: "month",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: filter.startDate,
        endDate: filter.endDate,
      });

      const response = await fetch(`/api/stats/exercises?${params}`);
      const data = await response.json();
      setStats(data.exercises || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filter]);

  const handlePeriodChange = (period: "week" | "month" | "year") => {
    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    setFilter({
      period,
      startDate: startDate.toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    });
  };

  const maxCount = Math.max(...stats.map((s) => s.count), 1);

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Análisis de Ejercicios</h2>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["week", "month", "year"] as const).map((period) => (
          <button
            key={period}
            onClick={() => handlePeriodChange(period)}
            className={`px-4 py-2 rounded font-semibold transition ${
              filter.period === period
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {period === "week"
              ? "Última Semana"
              : period === "month"
                ? "Último Mes"
                : "Último Año"}
          </button>
        ))}
      </div>

      {/* Estadísticas */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Cargando estadísticas...</p>
        ) : stats.length === 0 ? (
          <p className="text-gray-500">
            No hay datos disponibles para este período
          </p>
        ) : (
          stats.map((exercise) => (
            <div key={exercise.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">
                  {exercise.name}
                </span>
                <span className="text-sm text-gray-600">
                  {exercise.count} veces ({exercise.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all flex items-center justify-center"
                  style={{ width: `${(exercise.count / maxCount) * 100}%` }}
                >
                  {(exercise.count / maxCount) * 100 > 20 && (
                    <span className="text-white text-sm font-semibold text-center">
                      {exercise.count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tabla de detalles */}
      {stats.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Detalles</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Ejercicio</th>
                  <th className="px-4 py-2 text-right">Veces</th>
                  <th className="px-4 py-2 text-right">Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((exercise) => (
                  <tr key={exercise.name} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{exercise.name}</td>
                    <td className="px-4 py-3 text-right">{exercise.count}</td>
                    <td className="px-4 py-3 text-right">
                      {exercise.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
