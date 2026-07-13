import pg from 'pg';
import fs from 'fs';
import path from 'path';

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
        process.env[key] = value;
      }
    }
  }
}

async function main() {
  loadEnv();
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const catRes = await pool.query('SELECT count(*) FROM categories');
    console.log('Categories count:', catRes.rows[0].count);

    const temRes = await pool.query('SELECT count(*) FROM templates');
    console.log('Templates count:', temRes.rows[0].count);

    const admRes = await pool.query('SELECT count(*) FROM admins');
    console.log('Admins count:', admRes.rows[0].count);
    
    if (parseInt(catRes.rows[0].count) > 0) {
      const cats = await pool.query('SELECT * FROM categories');
      console.log('Categories:', cats.rows);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
