import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { getEnv } from './env';

/**
 * Singleton pg Pool for Vercel serverless functions.
 * Reuses connection across warm invocations via globalThis.
 */
function getPool(): Pool {
  const key = '_toygaPgPool';
  const g = globalThis as Record<string, unknown>;

  if (!g[key]) {
    const env = getEnv();
    g[key] = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }

  return g[key] as Pool;
}

export const pool = getPool();

/**
 * Execute a parameterized query with optional slow-query logging.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const result = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  if (duration > 500) {
    console.warn(`[SLOW QUERY] ${duration}ms — ${text.slice(0, 120)}`);
  }

  return result;
}

/**
 * Execute multiple statements within a transaction.
 * Automatically commits on success, rolls back on error.
 *
 * @example
 * const user = await transaction(async (client) => {
 *   const { rows } = await client.query('INSERT INTO users ... RETURNING *', [...]);
 *   await client.query('INSERT INTO audit_logs ...', [...]);
 *   return rows[0];
 * });
 */
export async function transaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
