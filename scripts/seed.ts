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

const categories = [
  { slug: "uylen-toy", title_kk: "Үйлену той", sort_order: 1, icon_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=200&fit=crop" },
  { slug: "kyz-uzatu", title_kk: "Қыз ұзату", sort_order: 2, icon_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=200&fit=crop" },
  { slug: "sundet-toy", title_kk: "Сүндет той", sort_order: 3, icon_url: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&h=200&fit=crop" },
  { slug: "tusaukesar", title_kk: "Тұсаукесер", sort_order: 4, icon_url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=200&fit=crop" },
  { slug: "merey-toy", title_kk: "Мерей той", sort_order: 5, icon_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=200&fit=crop" },
  { slug: "besik-toy", title_kk: "Бесік той", sort_order: 6, icon_url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=200&fit=crop" }
];

const templates = [
  {
    category_slug: "uylen-toy",
    code: "uylen_gold",
    title_kk: "Алтын үйлену шақыру",
    preview_img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop",
    price: 800,
    is_premium: false
  },
  {
    category_slug: "uylen-toy",
    code: "uylen_rose",
    title_kk: "Раушан гүлді шақыру",
    preview_img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=500&fit=crop",
    price: 0,
    is_premium: false
  },
  {
    category_slug: "kyz-uzatu",
    code: "uzatu_classic",
    title_kk: "Қыз ұзату классик",
    preview_img: "https://images.unsplash.com/photo-1596003906949-67221c37965c?w=400&h=500&fit=crop",
    price: 800,
    is_premium: false
  },
  {
    category_slug: "sundet-toy",
    code: "sundet_sky",
    title_kk: "Сүндет той — Аспан",
    preview_img: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&h=500&fit=crop",
    price: 800,
    is_premium: false
  },
  {
    category_slug: "tusaukesar",
    code: "tusau_bakhyt",
    title_kk: "Тұсаукесер — Бақыт",
    preview_img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=500&fit=crop",
    price: 0,
    is_premium: false
  },
  {
    category_slug: "merey-toy",
    code: "merey_gold",
    title_kk: "Мерей той — Алтын жыл",
    preview_img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=500&fit=crop",
    price: 1200,
    is_premium: true
  }
];

async function main() {
  loadEnv();
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set.');
    return;
  }

  const pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const catCheck = await pool.query('SELECT count(*) FROM categories');
    if (parseInt(catCheck.rows[0].count) === 0) {
      console.log('Seeding categories...');
      for (const cat of categories) {
        await pool.query(
          'INSERT INTO categories (slug, title_kk, icon_url, sort_order) VALUES ($1, $2, $3, $4)',
          [cat.slug, cat.title_kk, cat.icon_url, cat.sort_order]
        );
      }
    } else {
      console.log('Categories already seeded.');
    }

    const tempCheck = await pool.query('SELECT count(*) FROM templates');
    if (parseInt(tempCheck.rows[0].count) === 0) {
      console.log('Seeding templates...');
      for (const temp of templates) {
        const catRes = await pool.query('SELECT id FROM categories WHERE slug = $1', [temp.category_slug]);
        const catId = catRes.rows[0]?.id;
        if (catId) {
          await pool.query(
            'INSERT INTO templates (category_id, code, title_kk, preview_img, price, is_premium) VALUES ($1, $2, $3, $4, $5, $6)',
            [catId, temp.code, temp.title_kk, temp.preview_img, temp.price, temp.is_premium]
          );
        }
      }
    } else {
      console.log('Templates already seeded.');
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
}

main();
