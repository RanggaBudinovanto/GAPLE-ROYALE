# Panduan Deploy — GAPLE ROYALE
### 100% Gratis · GitHub Pages + Railway.app

---

## Opsi Deploy (Semua Gratis)

| Komponen | Platform | Batas Gratis | Link |
|---|---|---|---|
| Frontend (HTML) | GitHub Pages | Unlimited | pages.github.com |
| Frontend (alt) | Netlify | 100GB bandwidth/bulan | netlify.com |
| Backend Node.js | Railway.app | $5 credit/bulan (cukup) | railway.app |
| Database MySQL | Railway.app | Included | railway.app |
| Redis Cache | Upstash | 10.000 cmd/hari | upstash.com |

---

## Deploy Frontend (GitHub Pages)

### Langkah 1: Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit: Gaple Royale"
git branch -M main
git remote add origin https://github.com/USERNAME/gaple-royale.git
git push -u origin main
```

### Langkah 2: Enable GitHub Pages
1. Buka repo di GitHub
2. Klik **Settings** → **Pages** (sidebar kiri)
3. Source: **Deploy from a branch**
4. Branch: **main** → Folder: **/ (root)**
5. Klik **Save**
6. URL akan tersedia di: `https://USERNAME.github.io/gaple-royale`

### Langkah 3: Update API URL
Edit `js/api.js`, ubah BASE_URL:
```javascript
// Development
const BASE_URL = 'http://localhost:3000/api/v1';

// Production
const BASE_URL = 'https://gaple-royale-backend.railway.app/api/v1';
```

---

## Deploy Frontend (Netlify — Alternatif Lebih Mudah)

### Cara 1: Drag & Drop
1. Buka [netlify.com/drop](https://netlify.com/drop)
2. Drag folder `gaple-royale` ke area drop
3. Otomatis deploy! URL random diberikan
4. Bisa custom domain di settings

### Cara 2: Connect GitHub
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=.
```

---

## Deploy Backend (Railway.app)

### Langkah 1: Buat Akun Railway
1. Buka [railway.app](https://railway.app)
2. Login dengan GitHub

### Langkah 2: Buat Project Baru
1. Klik **New Project**
2. Pilih **Deploy from GitHub repo**
3. Pilih repo `gaple-royale`
4. Set **Root Directory** ke `backend`

### Langkah 3: Tambah MySQL Database
1. Di project Railway, klik **+ New**
2. Pilih **Database → MySQL**
3. Railway otomatis inject env vars: `MYSQL_URL`, `MYSQL_HOST`, dll.

### Langkah 4: Tambah Redis
1. Klik **+ New** lagi
2. Pilih **Database → Redis**
3. Env var `REDIS_URL` otomatis tersedia

### Langkah 5: Set Environment Variables
Di Railway dashboard → backend service → Variables:
```
NODE_ENV=production
JWT_SECRET=ganti_dengan_string_random_panjang_ini
ALLOWED_ORIGINS=https://USERNAME.github.io
```
(DB dan Redis sudah otomatis dari step sebelumnya)

### Langkah 6: Setup Database
Railway menyediakan MySQL console. Jalankan:
```sql
-- Paste isi file docker/mysql/init.sql di sini
```

Atau via CLI:
```bash
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < docker/mysql/init.sql
```

### Langkah 7: Dapatkan URL Backend
Di Railway → backend service → Settings → copy **Public Domain**
Contoh: `gaple-royale-backend-production.up.railway.app`

---

## Deploy Lengkap dengan Docker (Lokal / VPS)

### Prasyarat
- Docker Desktop terinstall
- Docker Compose v2+

### Jalankan Semua Service
```bash
# Clone repo
git clone https://github.com/USERNAME/gaple-royale.git
cd gaple-royale

# Jalankan semua service
docker compose up --build

# Tunggu sampai semua service ready (~2 menit)
# Lalu buka: http://localhost
```

### Service yang Berjalan
| Service | Port | URL |
|---|---|---|
| Nginx (Load Balancer) | 80 | http://localhost |
| Backend Instance 1 | 3000 | http://localhost:3000 |
| Backend Instance 2 | 3001 | http://localhost:3001 |
| MySQL Primary | 3306 | localhost:3306 |
| MySQL Replica | 3307 | localhost:3307 |
| Redis | 6379 | localhost:6379 |

### Hentikan Semua Service
```bash
docker compose down

# Hapus semua data (database reset)
docker compose down -v
```

---

## Setup Development Lokal (Tanpa Docker)

### Frontend
```bash
# Tidak butuh build tools!
# Opsi 1: Buka langsung index.html di browser
# Opsi 2: Gunakan live server
npm install -g live-server
live-server --port=5500
```

### Backend
```bash
cd backend

# Install dependencies
npm install

# Copy dan edit env
cp .env.example .env
# Edit .env: isi DB_HOST, DB_USER, DB_PASS, dll.

# Install MySQL lokal atau gunakan XAMPP
# Jalankan SQL schema:
mysql -u root -p < ../docker/mysql/init.sql

# Start server
node server.js
# atau dengan hot-reload:
npm install -g nodemon
nodemon server.js
```

---

## Checklist Sebelum Go Live

- [ ] JWT_SECRET diganti dengan string random yang kuat (min 32 char)
- [ ] ALLOWED_ORIGINS diset ke domain frontend yang benar
- [ ] Database sudah di-seed dengan init.sql
- [ ] API URL di frontend sudah diupdate ke URL production
- [ ] Test register + login berhasil
- [ ] Test beli item berhasil
- [ ] Test buat game vs bot berhasil
- [ ] Test leaderboard tampil
- [ ] HTTPS aktif (Railway dan Netlify/GitHub Pages otomatis HTTPS)

---

## Troubleshooting Umum

**Frontend tidak bisa akses backend (CORS error):**
- Pastikan `ALLOWED_ORIGINS` di backend = URL frontend yang exact
- Contoh: `ALLOWED_ORIGINS=https://username.github.io`

**Database connection refused:**
- Railway: tunggu 2-3 menit setelah deploy, MySQL butuh waktu startup
- Lokal: pastikan MySQL service berjalan (`sudo service mysql start`)

**WebSocket tidak konek:**
- Railway: pastikan backend service menggunakan port dari env var `PORT` (bukan hardcode)
- Nginx: pastikan config WebSocket upgrade sudah benar (lihat nginx.conf)

**Coin tidak tersimpan setelah refresh:**
- Pastikan state disimpan ke localStorage setelah setiap transaksi
- Cek function `state.set('coin', newValue)` terpanggil dan `storage.save('user', userData)` dijalankan
