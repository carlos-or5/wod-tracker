#!/usr/bin/env node

/**
 * Script para ejecutar migraciones de BD
 * Uso: node scripts/migrate-db.js
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: ".env.local" });

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("🔄 Conectando a la base de datos...");
    await client.connect();
    console.log("✅ Conectado");

    // Leer el archivo de migración
    const migrationPath = path.join(
      __dirname,
      "../db/migration_ai_features.sql",
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("\n📝 Ejecutando migración...");
    await client.query(migrationSQL);
    console.log("✅ Migración completada exitosamente");

    // Verificar tablas creadas
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('wod_analyses', 'exercise_weights')
    `);

    if (result.rows.length === 2) {
      console.log("\n📊 Tablas creadas:");
      result.rows.forEach((row) => console.log(`  ✓ ${row.table_name}`));
    }

    console.log("\n✨ Migración completada. Puedes comenzar a usar la IA!");
  } catch (error) {
    console.error("❌ Error en la migración:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
