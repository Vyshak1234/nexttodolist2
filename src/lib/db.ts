import { Pool, QueryResult, QueryResultRow } from "pg";

// Read database credentials from environment variables (matching your SecretProviderClass keys)
const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT || 5432);
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbname = process.env.DB_NAME;

// Validate that all required environment variables exist
if (!host || !username || !password || !dbname) {
  throw new Error(
    `Missing database environment variables.
    DB_HOST=${host}
    DB_USER=${username}
    DB_PASSWORD=${password ? "********" : undefined}
    DB_NAME=${dbname}
    DB_PORT=${port}`
  );
}

// Build PostgreSQL connection string
const connectionString = `postgres://${encodeURIComponent(username)}:${encodeURIComponent(
  password
)}@${host}:${port}/${dbname}`;

// Enable SSL automatically for RDS
const ssl = host.includes("rds.amazonaws.com") ? { rejectUnauthorized: false } : undefined;

// Create connection pool
const pool = new Pool({
  connectionString,
  ssl,
});

// Generic query function
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

// Optional: quick test function (remove in production)
export async function testConnection() {
  try {
    const result = await query("SELECT NOW()");
    console.log("Database connected. Current time:", result.rows[0]);
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}
