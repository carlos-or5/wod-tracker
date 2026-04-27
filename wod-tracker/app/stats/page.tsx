import { WodStatistics } from "@/app/components/WodStatistics";

export const metadata = {
  title: "Estadísticas - WOD Tracker",
  description: "Análisis de ejercicios por período",
};

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Estadísticas</h1>
          <p className="text-gray-600">
            Análisis de los ejercicios más practicados en el período
            seleccionado
          </p>
        </div>

        <WodStatistics />
      </div>
    </div>
  );
}
