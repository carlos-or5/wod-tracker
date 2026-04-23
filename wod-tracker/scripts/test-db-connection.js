import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Client } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    const res = await client.query("SELECT now() AS now");
    console.log("Conexión OK — hora en BD:", res.rows[0].now);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error("Error de conexión:", err.message);
    process.exit(1);
  }
})();
