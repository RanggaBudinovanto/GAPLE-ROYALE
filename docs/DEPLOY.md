# Panduan Deploy — GAPLE ROYALE

## 1. Frontend (Static — Gratis)

### GitHub Pages
```bash
git add . && git commit -m "deploy" && git push origin main
# Buka repo di GitHub → Settings → Pages → Branch: main → /root → Save
# URL: https://username.github.io/gaple-royale
```

### Netlify
```bash
# Drag-drop folder project ke netlify.com/drop
# Atau gunakan CLI:
npx netlify-cli deploy --prod --dir=.
```

### Vercel
```bash
npx vercel --prod
```

## 2. Backend (Node.js — Gratis)

### Railway.app
1. Buat akun di railway.app
2. New Project → Deploy from GitHub Repo
3. Pilih folder `backend/` sebagai root
4. Tambah MySQL: New → Database → MySQL
5. Tambah Redis: New → Database → Redis
6. Set environment variables dari `.env.example`
7. Deploy otomatis setiap push

### Render.com
1. New → Web Service → Connect GitHub
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Pilih Free tier

## 3. Database (MySQL — Gratis)

### Railway.app
- Add Plugin → MySQL (gratis 1GB)
- Salin connection string ke env vars backend

### PlanetScale.com
- Free tier 5GB
- Import schema: `docker/mysql/init.sql`

## 4. Redis (Gratis)

### Upstash.com
- Free tier 10K commands/hari
- Salin REDIS_HOST dan REDIS_PORT ke env vars

### Railway.app
- Add Plugin → Redis

## 5. Docker (Self-hosted / VPS)

```bash
# Clone repo
git clone https://github.com/username/gaple-royale.git
cd gaple-royale

# Jalankan semua service
cd docker
docker compose up --build -d

# Cek status
docker compose ps

# Lihat logs
docker compose logs -f backend1

# Stop
docker compose down
```

### Setup MySQL Replication (Opsional)

```sql
-- Di MySQL Primary (my.cnf):
[mysqld]
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = gaple_royale

-- Di MySQL Replica (my.cnf):
[mysqld]
server-id = 2
relay-log = /var/log/mysql/mysql-relay-bin.log

-- Setup di Replica:
CHANGE MASTER TO
  MASTER_HOST='mysql-primary',
  MASTER_USER='replication_user',
  MASTER_PASSWORD='repl_pass',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=0;
START SLAVE;
```

## 6. Environment Variables

| Variable | Contoh | Keterangan |
|----------|--------|------------|
| `PORT` | 3000 | Port backend |
| `DB_HOST` | mysql-primary | Host MySQL |
| `DB_PORT` | 3306 | Port MySQL |
| `DB_USER` | root | User MySQL |
| `DB_PASS` | rootpass | Password MySQL |
| `DB_NAME` | gaple_royale | Nama database |
| `REDIS_HOST` | redis | Host Redis |
| `REDIS_PORT` | 6379 | Port Redis |
| `JWT_SECRET` | random_string | Secret untuk JWT |
| `ALLOWED_ORIGINS` | https://domain.com | CORS origins |
