// Script to generate bcrypt hash for admin password
// Run: node db/hash-password.mjs
import bcrypt from 'bcryptjs';

const password = 'I.love.eww.05';
const saltRounds = 12;
const hash = await bcrypt.hash(password, saltRounds);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\n-- SQL INSERT for seed.sql:');
console.log(`INSERT INTO admins (email, password_hash) VALUES ('omarakim2005@gmail.com', '${hash}');`);
