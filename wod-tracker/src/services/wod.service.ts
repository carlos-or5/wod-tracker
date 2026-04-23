import { sql } from "../lib/db";

// Obtener todos los WODs
export async function getWods() {
  return await sql`
    SELECT * FROM wods
    ORDER BY date DESC
  `;
}

// Crear WOD
export async function createWod(date: string, title: string) {
  return await sql`
    INSERT INTO wods (date, title)
    VALUES (${date}, ${title})
    RETURNING *
  `;
}

// 🔴 BORRAR WOD
export async function deleteWod(id: number) {
  return await sql`
    DELETE FROM wods
    WHERE id = ${id}
    RETURNING *
  `;
}
