import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "apeiron",
  password: "1111",
  database: "voting",
});
export const db = drizzle(pool);
