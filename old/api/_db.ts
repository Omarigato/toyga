import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Singleton pool — Vercel serverless functions may reuse the module
let pool: Pool;

if (!(globalThis as Record<string, unknown>)._pgPool) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('localhost')
            ? false
            : { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });
    (globalThis as Record<string, unknown>)._pgPool = pool;
} else {
    pool = (globalThis as Record<string, unknown>)._pgPool as Pool;
}

export { pool };
