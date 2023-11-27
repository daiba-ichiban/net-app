import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "@/db/schema";

const connectionString = process.env.DB_URL!;
const client = postgres(connectionString, { max: 1 });

export const db = drizzle(client, { schema: schema, logger: true });
// await migrate(db, { migrationsFolder: "drizzle" });

export default db;
