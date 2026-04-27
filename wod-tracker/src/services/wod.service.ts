import { db } from "../lib/db";

// Obtener todos los WODs
export async function getWods() {
  const result = await db.query(`SELECT * FROM wods ORDER BY date DESC`);
  return result.rows;
}

// Obtener WOD por ID con todos sus detalles
export async function getWodDetail(wodId: string) {
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

  const result = await db.query(query, [wodId]);
  return result.rows[0] || null;
}

// Crear WOD básico
export async function createWod(
  date: string,
  title: string,
  description?: string,
  isEndurance?: boolean,
) {
  const result = await db.query(
    `INSERT INTO wods (date, title, description, is_endurance)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [date, title || null, description || null, isEndurance || false],
  );
  return result.rows[0];
}

// Obtener ejercicios disponibles
export async function getExercises() {
  const result = await db.query(
    `SELECT id, name, category FROM exercises ORDER BY category, name`,
  );
  return result.rows;
}

// Obtener análisis pendientes
export async function getPendingAnalyses() {
  const result = await db.query(
    `SELECT wa.*, w.date, w.title 
     FROM wod_analyses wa
     JOIN wods w ON wa.wod_id = w.id
     WHERE wa.status = 'pending'
     ORDER BY wa.created_at DESC`,
  );
  return result.rows;
}

// Obtener análisis confirmados
export async function getConfirmedAnalyses(limit = 10) {
  const result = await db.query(
    `SELECT wa.*, w.date, w.title 
     FROM wod_analyses wa
     JOIN wods w ON wa.wod_id = w.id
     WHERE wa.status = 'confirmed'
     ORDER BY wa.confirmed_at DESC
     LIMIT $1`,
    [limit],
  );
  return result.rows;
}
