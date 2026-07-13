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
    const { rows: templates } = await pool.query(`
      SELECT t.id, t.code, t.title_kk, t.price, t.is_premium, t.is_active, c.slug as category_slug
      FROM templates t
      LEFT JOIN categories c ON t.category_id = c.id
    `);
    console.log('--- TEMPLATES IN DATABASE ---');
    console.log(templates);
  } catch (err) {
    console.error('Error listing templates:', err);
  } finally {
    await pool.end();
  }
}

main();
