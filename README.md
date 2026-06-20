# GAPLE ROYALE

**Premium Casino Domino Game — Web Application**

Game domino bergaya casino premium yang dapat dimainkan langsung di browser. Dibangun sebagai implementasi nyata dari materi kuliah **Sistem Terdistribusi**.

---

## 🎮 Fitur Utama

### Gameplay
- Gameplay Gaple lengkap (28 kartu, aturan standar Indonesia)
- Gaple detection: pemenang saat semua kartu habis atau semua pemain diblokir (pip terkecil menang)
- Timer giliran per pemain (30 detik), auto-pass jika waktu habis

### Mode Permainan (Multi-Step Matchmaking)
Setiap mode mendukung sub-pilihan format meja:

| Mode | Format | Deskripsi |
|------|--------|-----------|
| 🟢 Classic | 1v1 atau Ber-4 | Mode santai tanpa ranking |
| 🏆 Ranked | 1v1 atau Ber-4 | Sistem RP (Rank Points), tier Bronze → Legend |
| 🤖 VS A.I. | 1v1 atau Ber-4 | Lawan bot Easy / Hard secara offline |
| 💰 Bertaruh | 1v1 atau Ber-4 | Mode taruhan koin nyata (lihat detail di bawah) |

### Mode Bertaruh (Betting Mode)
- Pilihan nominal taruhan: **100, 500, 1000, 2000, 5000** koin
- Koin dipotong **upfront** dari semua pemain sebelum game mulai
- Chip taruhan terkunci (disabled) jika saldo tidak mencukupi
- **Pemenang** menyapu bersih seluruh pool: `taruhan × jumlah pemain`
- **Pecundang** mendapat 0 koin
- Semua transaksi tercatat di database (riwayat `earn` / `spend`)

### Karakter & Kosmetik
- 4 karakter 2D unik dengan SVG art (tanpa gambar eksternal)
- 4 skin kartu domino (Classic, Royal Gold, dll.)
- Sistem karakter pasif (Si Hoki, Juragan Meja, Sang Bluffer)

### Power-Up In-Game
- 🔀 **Shuffle** — Acak kartu di tangan
- 👁️ **Peek** — Lihat kartu lawan sebentar
- 🚫 **Block** — Kunci satu kartu lawan
- 💰 **Double Coin** — Gandakan reward koin ronde ini

### Multiplayer & Sosial
- PvP real-time via Socket.io WebSocket
- Voice chat antar pemain (WebRTC)
- In-game text chat + emoji reactions
- Leaderboard global & mingguan (Redis cache)

### Sistem Ekonomi
- Koin virtual: earn dari menang, spend di shop atau taruhan
- Shop item: karakter, skin, power-up
- Daily login bonus & daily mission
- Achievement sistem (Raja Gaple, dll.)

### Sistem Ranking
- Rank Points (RP) naik/turun per match Ranked
- Tier: 🥉 Bronze → 🥈 Silver → 🥇 Gold → 💎 Diamond → 👑 Legend
- Badge tier tampil di profil & matchmaking lobby

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JS + GSAP |
| Backend | Node.js + Express + Socket.io |
| Database | MySQL 8.0 (Primary + Replica) |
| Cache | Redis 7 |
| Infrastructure | Docker + Nginx |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Deploy | Railway (production) |

---

## 🚀 Quick Start

### Frontend saja (tanpa backend)
```bash
npx serve . -p 5500
# Buka http://localhost:5500
# Login offline tersedia, PvP & Betting dinonaktifkan
```

### Backend + Frontend (lokal penuh)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET
node server.js
# Buka http://localhost:3000
```

### Docker (semua service sekaligus)
```bash
cd docker
docker compose up --build
# Buka http://localhost
```

---

## 📁 Struktur Proyek

```
gaple-royale/
├── index.html              ← Entry point frontend SPA
├── css/
│   ├── tokens.css          ← Design tokens (warna, spacing, tipografi)
│   ├── base.css            ← Reset & base styles
│   ├── components.css      ← Komponen UI (card, btn, input, dll.)
│   ├── game.css            ← Layout khusus halaman game
│   ├── characters.css      ← SVG karakter styles
│   └── animations.css      ← Keyframe & GSAP helpers
├── js/
│   ├── app.js              ← Bootstrap & event listeners global
│   ├── router.js           ← SPA hash-based router
│   ├── state.js            ← Global state + backend sync
│   ├── auth.js             ← Auth helper (offline JWT)
│   ├── config.js           ← API base URL & apiCall helper
│   ├── pages/              ← Halaman SPA
│   │   ├── splash.js
│   │   ├── auth.js         ← Login & Register (online + offline)
│   │   ├── lobby.js
│   │   ├── matchmaking.js  ← Multi-step matchmaking + Betting Mode
│   │   ├── game.js         ← Game engine client + PvP socket
│   │   ├── result.js       ← Halaman hasil + betting breakdown
│   │   ├── leaderboard.js
│   │   ├── profile.js
│   │   ├── shop.js
│   │   └── inventory.js
│   ├── game/
│   │   ├── domino.js       ← Logika kartu & distribusi
│   │   ├── board.js        ← State papan permainan
│   │   ├── bot.js          ← AI bot (Easy / Hard)
│   │   ├── powerups.js     ← Sistem power-up
│   │   └── scoring.js      ← Kalkulasi reward + betting pool
│   ├── components/         ← UI components reusable
│   └── utils/              ← Format, storage, animation, sfx
├── backend/
│   ├── server.js           ← Express + Socket.io + auto DB migration
│   ├── services/
│   │   ├── matchmaking.service.js  ← Queue, coin deduction upfront, payout
│   │   ├── game.service.js         ← Game state, betting payout authoritative
│   │   └── chat.service.js
│   ├── routes/             ← REST API endpoints
│   ├── middleware/         ← Auth (JWT) + rate limiting
│   └── models/             ← MySQL connection pool (primary + replica)
├── docker/
│   ├── docker-compose.yml
│   ├── nginx/nginx.conf
│   └── mysql/init.sql
└── assets/                 ← Tier icons & static assets
```

---

## 🔌 API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/v1/auth/register` | Daftar akun baru |
| POST | `/api/v1/auth/login` | Login, returns JWT |
| GET | `/api/v1/auth/me` | Info user dari token |
| POST | `/api/v1/matchmaking/create` | Buat/join room (PvP atau Bot) |
| GET | `/api/v1/matchmaking/status/:roomId` | Cek status room |
| DELETE | `/api/v1/matchmaking/cancel/:roomId` | Batalkan pencarian |
| GET | `/api/v1/ranking/leaderboard` | Leaderboard global |
| GET | `/api/v1/users/:id/inventory` | Inventori user |
| POST | `/api/v1/game/local-end` | Simpan hasil game offline |

---

## 🏦 Alur Betting Mode

```
User pilih "Bertaruh" → pilih format (1v1 / Ber-4)
  → pilih nominal taruhan (chip disabled jika koin kurang)
    → Lobby terbentuk
      → Backend potong koin semua pemain UPFRONT
        → Game berlangsung
          → Game selesai → Backend hitung pemenang
            → Pemenang: dapat taruhan × jumlah pemain
            → Pecundang: dapat 0 koin
              → Transaksi dicatat di DB (earn/spend)
```

---

## 🌐 Deployment

Aplikasi ini di-deploy ke **Railway**:
- Backend Node.js + Express + Socket.io berjalan di Railway
- Database MySQL dihosting di Railway MySQL plugin
- Frontend di-serve langsung oleh Express (static files dari root)
- Auto-migration: kolom `bet_amount`, `is_ranked`, `rank_points` ditambahkan otomatis saat boot jika belum ada

---

## 📝 Dibuat Untuk

Proyek Kuliah **Sistem Terdistribusi** — Mini Multiplayer Game Backend

---

*Gaple Royale — Meja Terbaik, Taruhan Terbesar* 🎰
