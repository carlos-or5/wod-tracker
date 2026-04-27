import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "2024-01-01";
    const endDate =
      searchParams.get("endDate") || new Date().toISOString().split("T")[0];

    const query = `
      SELECT 
        e.name,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
      FROM wod_exercises we
      JOIN exercises e ON we.exercise_id = e.id
      JOIN wod_variants wv ON we.wod_variant_id = wv.id
      JOIN wod_blocks wb ON wv.wod_block_id = wb.id
      JOIN wods w ON wb.wod_id = w.id
      WHERE w.date >= $1 AND w.date <= $2
      GROUP BY e.id, e.name
      ORDER BY count DESC
    `;

    const result = await db.query(query, [startDate, endDate]);

    return NextResponse.json({
      exercises: result.rows,
      period: { startDate, endDate },
      total: result.rows.reduce((sum, row) => sum + row.count, 0),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}
