import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  query: async (text: string, values?: any[]) => {
    try {
      const result = await pool.query(text, values || []);
      return { rows: result.rows };
    } catch (error) {
      console.error("DB Query Error:", { text, values, error });
      throw error;
    }
  },
};
