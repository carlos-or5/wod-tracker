import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const month = searchParams.get("month");

    if (date) {
      // Obtener WOD de una fecha específica
      const result = await db.query(
        `SELECT id, date, title, description, is_endurance 
         FROM wods 
         WHERE date = $1 
         LIMIT 1`,
        [date]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ wod: null });
      }

      // Obtener detalles completos
      const wod = result.rows[0];
      const detailsResult = await db.query(
        `SELECT 
          wb.id as block_id,
          wb.wod_type,
          wv.id as variant_id,
          wv.difficulty,
          we.id as exercise_id,
          we.order_index,
          ex.name as exercise_name,
          we.reps,
          we.weight,
          we.distance,
          we.time_seconds,
          we.notes
        FROM wod_blocks wb
        LEFT JOIN wod_variants wv ON wb.id = wv.wod_block_id
        LEFT JOIN wod_exercises we ON wv.id = we.wod_variant_id
        LEFT JOIN exercises ex ON we.exercise_id = ex.id
        WHERE wb.wod_id = $1
        ORDER BY wb.order_index, wv.difficulty, we.order_index`,
        [wod.id]
      );

      return NextResponse.json({ wod, details: detailsResult.rows });
    }

    if (month) {
      // Obtener todos los WODs del mes (YYYY-MM)
      const result = await db.query(
        `SELECT DISTINCT date FROM wods WHERE date LIKE $1 ORDER BY date`,
        [`${month}%`]
      );

      return NextResponse.json({
        dates: result.rows.map((r) => r.date),
      });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching WODs:", error);
    return NextResponse.json(
      { error: "Failed to fetch WODs" },
      { status: 500 }
    );
  }
}
