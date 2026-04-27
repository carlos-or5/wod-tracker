import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/db";

interface Exercise {
  name: string;
  reps?: number;
  weight?: string;
  distance?: string;
  time?: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      analysisId,
      wodId: bodyWodId,
      exercises,
      title,
      description,
      type,
    } = body;

    if (!exercises || (!analysisId && !bodyWodId)) {
      return NextResponse.json(
        {
          error: "Missing required fields: exercises and (analysisId or wodId)",
        },
        { status: 400 },
      );
    }

    let wodId: string;

    // Si viene analysisId (flujo de foto), obtener wodId
    if (analysisId) {
      const analysisResult = await db.query(
        "SELECT wod_id FROM wod_analyses WHERE id = $1",
        [analysisId],
      );

      if (analysisResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Analysis not found" },
          { status: 404 },
        );
      }
      wodId = analysisResult.rows[0].wod_id;
    } else {
      // Flujo JSON manual: usar wodId del body
      wodId = bodyWodId;
    }

    console.log(`📝 Creating exercises for WOD: ${wodId}`);

    // Actualizar WOD
    await db.query(
      "UPDATE wods SET title = $1, description = $2 WHERE id = $3",
      [title, description, wodId],
    );

    // Obtener o crear WOD block
    let blockResult = await db.query(
      "SELECT id FROM wod_blocks WHERE wod_id = $1 AND block_type = 'METCON' LIMIT 1",
      [wodId],
    );

    let blockId: string;
    if (blockResult.rows.length === 0) {
      const createBlockResult = await db.query(
        "INSERT INTO wod_blocks (wod_id, block_type, wod_type, order_index) VALUES ($1, 'METCON', $2, 1) RETURNING id",
        [wodId, type || "FOR_TIME"],
      );
      blockId = createBlockResult.rows[0].id;
      console.log(`✅ Created WOD block: ${blockId}`);
    } else {
      blockId = blockResult.rows[0].id;
      console.log(`✅ Using existing WOD block: ${blockId}`);
    }

    // Crear variantes RX, SCALED, INTERMEDIATE
    const difficulties = ["RX", "SCALED", "INTERMEDIATE"] as const;
    const variantIds: Record<string, string> = {};

    for (const difficulty of difficulties) {
      const variantResult = await db.query(
        "INSERT INTO wod_variants (wod_block_id, difficulty) VALUES ($1, $2) RETURNING id",
        [blockId, difficulty],
      );
      variantIds[difficulty] = variantResult.rows[0].id;
    }

    console.log(`✅ Created variants: ${JSON.stringify(variantIds)}`);

    // Agregar ejercicios a cada variante
    for (const difficulty of difficulties) {
      const variantId = variantIds[difficulty];

      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];

        // Obtener ID del ejercicio por nombre
        let exerciseResult = await db.query(
          "SELECT id FROM exercises WHERE LOWER(name) = LOWER($1)",
          [exercise.name],
        );

        let exerciseId = null;
        if (exerciseResult.rows.length === 0) {
          // Crear ejercicio si no existe
          const createExerciseResult = await db.query(
            "INSERT INTO exercises (name, category) VALUES ($1, 'OTHER') RETURNING id",
            [exercise.name],
          );
          exerciseId = createExerciseResult.rows[0].id;
          console.log(`📝 Created new exercise: ${exercise.name}`);
        } else {
          exerciseId = exerciseResult.rows[0].id;
        }

        // Insertar ejercicio en WOD
        await db.query(
          `INSERT INTO wod_exercises 
          (wod_variant_id, exercise_id, order_index, reps, weight, distance, time_seconds, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            variantId,
            exerciseId,
            i,
            exercise.reps || null,
            exercise.weight || null,
            exercise.distance || null,
            null, // time_seconds
            exercise.notes || null,
          ],
        );
      }
    }

    console.log(`✅ Exercises created for all variants`);

    // Marcar análisis como confirmado (solo si existe)
    if (analysisId) {
      await db.query(
        "UPDATE wod_analyses SET status = 'confirmed', confirmed_at = NOW() WHERE id = $1",
        [analysisId],
      );
    }

    console.log(`✅ WOD confirmed successfully`);

    return NextResponse.json({
      success: true,
      wodId,
      message: "WOD creado exitosamente",
    });
  } catch (error) {
    console.error("Error confirming analysis:", error);
    return NextResponse.json(
      { error: "Failed to confirm analysis" },
      { status: 500 },
    );
  }
}
