import fs from 'fs';
import path from 'path';
import pg from 'pg';

// Simple .env parser in case environment variables aren't loaded
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

async function main() {
  loadEnv();

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Error: DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    const migrationPath = path.resolve(process.cwd(), 'db/migrations/0001_init.sql');
    console.log(`Reading migration from ${migrationPath}...`);
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Executing migration query...');
    await pool.query(sql);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
