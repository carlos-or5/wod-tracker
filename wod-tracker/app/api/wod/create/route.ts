import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { date, title, description, isEndurance } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: "Missing required field: date" },
        { status: 400 },
      );
    }

    const query = `
      INSERT INTO wods (date, title, description, is_endurance)
      VALUES ($1, $2, $3, $4)
      RETURNING id, date, title, description, is_endurance
    `;

    const result = await db.query(query, [
      date,
      title || null,
      description || null,
      isEndurance || false,
    ]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating WOD:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create WOD";

    // Manejo de error de fecha duplicada
    if (errorMessage.includes("unique")) {
      return NextResponse.json(
        { error: "Ya existe un WOD para esta fecha" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
