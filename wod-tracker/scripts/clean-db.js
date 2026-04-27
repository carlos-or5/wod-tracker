#!/usr/bin/env node

/**
 * Clean script: Remove all WODs and related data
 */

const { Pool } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

async function cleanDB() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("🧹 Limpiando base de datos...");

    // Delete in order of foreign key dependencies
    await pool.query("DELETE FROM wod_exercises");
    console.log("✓ Ejercicios borrados");

    await pool.query("DELETE FROM wod_variants");
    console.log("✓ Variantes borradas");

    await pool.query("DELETE FROM wod_blocks");
    console.log("✓ Bloques borrados");

    await pool.query("DELETE FROM wod_analyses");
    console.log("✓ Análisis borrados");

    await pool.query("DELETE FROM wods");
    console.log("✓ WODs borrados");

    console.log("\n✅ Base de datos limpia");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

cleanDB();
