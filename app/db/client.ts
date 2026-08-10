import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV } from "@env";
import * as schema from "./schema";

export const db = drizzle(postgres(ENV.DATABASE_URL, { prepare: false }), { schema });
