import { Pool, QueryResult, QueryResultRow } from "pg";

// Determine database connection dynamically
const connectionString =
  process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}` +
    `@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Detect if we need SSL (for RDS)
const ssl =
  process.env.DB_HOST?.includes("rds.amazonaws.com") || connectionString.includes("rds.amazonaws.com")
    ? { rejectUnauthorized: false }
    : undefined;

// Create pool
const pool = new Pool({
  connectionString,
  ssl,
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

