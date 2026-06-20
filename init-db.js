/**
 * init-db.js
 * Script untuk inisialisasi tabel database di Railway MySQL.
 * Jalankan sekali setelah database Railway terhubung:
 *   node backend/init-db.js
 */

require('dotenv').config({ path: require('path').join(__dirname, 'backend', '.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function init() {
  console.log('Menghubungkan ke database...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`DB: ${process.env.DB_NAME}`);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME || 'gaple_royale',
    multipleStatements: true
  });

  console.log('Terhubung! Membuat database dan tabel...');

  const schemaPath = path.join(__dirname, 'docker', 'mysql', 'init.sql');
  let schema = fs.readFileSync(schemaPath, 'utf8');

  // Untuk Railway, database sudah dibuat. Skip CREATE DATABASE.
  // Tapi tetap jalankan USE dan CREATE TABLE
  if (process.env.RAILWAY_ENVIRONMENT) {
    // Di Railway, database sudah ada. Tambahkan IF NOT EXISTS saja.
    schema = schema.replace(/^CREATE DATABASE IF NOT EXISTS gaple_royale;\nUSE gaple_royale;/m, 
      `-- Database sudah dibuat oleh Railway`);
  }

  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let success = 0;
  let skipped = 0;

  for (const stmt of statements) {
    if (!stmt) continue;
    try {
      await connection.execute(stmt);
      success++;
    } catch (err) {
      if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_KEYNAME') {
        skipped++;
        continue;
      }
      console.warn(`Warning: ${err.message} (${stmt.substring(0, 60)}...)`);
    }
  }

  console.log(`\n✅ Database siap! ${success} statement berhasil, ${skipped} dilewati (sudah ada).`);
  await connection.end();
}

init().catch(err => {
  console.error('❌ Gagal inisialisasi database:', err.message);
  process.exit(1);
});
