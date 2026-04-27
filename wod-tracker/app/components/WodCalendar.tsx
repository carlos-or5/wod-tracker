"use client";

import { useState } from "react";
import Link from "next/link";

interface WodDay {
  date: string;
  hasWod: boolean;
}

interface WodCalendarProps {
  wodsInMonth: Set<string>;
  onDateSelect: (date: string) => void;
}

export function WodCalendar({ wodsInMonth, onDateSelect }: WodCalendarProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth())
  );

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthName = currentDate.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            ← Anterior
          </button>
          <h2 className="text-2xl font-bold capitalize">{monthName}</h2>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Siguiente →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"].map((day) => (
            <div key={day} className="text-center font-bold text-sm text-gray-600 py-2">
              {day}
            </div>
          ))}

          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} />;
            }

            const dateStr = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const isToday =
              dateStr ===
              `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
                today.getDate()
              ).padStart(2, "0")}`;

            const hasWod = wodsInMonth.has(dateStr);

            return (
              <Link
                key={day}
                href={`/?date=${dateStr}`}
                className={`p-3 rounded-lg text-center cursor-pointer transition ${
                  isToday
                    ? "bg-blue-600 text-white font-bold ring-2 ring-blue-400"
                    : hasWod
                      ? "bg-green-100 hover:bg-green-200 font-semibold"
                      : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => onDateSelect(dateStr)}
              >
                <div className="text-sm">{day}</div>
                {hasWod && !isToday && <div className="text-xs mt-1">📋</div>}
              </Link>
            );
          })}
        </div>

        <div className="text-xs text-gray-500">
          🔵 Hoy • 📋 Con WOD
        </div>
      </div>
    </div>
  );
}
