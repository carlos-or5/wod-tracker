import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const query = `
      SELECT 
        w.*,
        json_agg(
          json_build_object(
            'id', wb.id,
            'type', wb.block_type,
            'wodType', wb.wod_type,
            'duration', wb.duration_minutes,
            'variants', (
              SELECT json_agg(
                json_build_object(
                  'id', wv.id,
                  'difficulty', wv.difficulty,
                  'exercises', (
                    SELECT json_agg(
                      json_build_object(
                        'id', we.id,
                        'name', e.name,
                        'category', e.category,
                        'reps', we.reps,
                        'weight', we.weight,
                        'distance', we.distance,
                        'notes', we.notes
                      )
                      ORDER BY we.order_index
                    )
                    FROM wod_exercises we
                    LEFT JOIN exercises e ON we.exercise_id = e.id
                    WHERE we.wod_variant_id = wv.id
                  )
                )
              )
              FROM wod_variants wv
              WHERE wv.wod_block_id = wb.id
            )
          )
          ORDER BY wb.order_index
        ) as blocks
      FROM wods w
      LEFT JOIN wod_blocks wb ON w.id = wb.wod_id
      WHERE w.id = $1
      GROUP BY w.id
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "WOD not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching WOD:", error);
    return NextResponse.json({ error: "Failed to fetch WOD" }, { status: 500 });
  }
}
