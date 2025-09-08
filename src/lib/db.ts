import { Pool, QueryResult, QueryResultRow } from "pg";

// Read env vars directly from AWS Secret Manager sync (or Kubernetes secret)
const {
  DATABASE_URL,
  host,
  port,
  username,
  password,
  dbname,
} = process.env;

// Build connection string
const connectionString =
  DATABASE_URL ||
  `postgres://${encodeURIComponent(username || "")}:${encodeURIComponent(
    password || ""
  )}@${host}:${port || 5432}/${dbname}`;

// Enable SSL automatically for RDS
const ssl =
  host?.includes("rds.amazonaws.com") || connectionString.includes("rds.amazonaws.com")
    ? { rejectUnauthorized: false }
    : undefined;

// Create connection pool
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
