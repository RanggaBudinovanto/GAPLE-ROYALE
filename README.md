# GAPLE ROYALE

**Premium Casino Domino Game — Web Application**

Game domino bergaya casino premium yang dapat dimainkan langsung di browser. Dibangun sebagai implementasi nyata dari materi kuliah **Sistem Terdistribusi**.

## Fitur

- Gameplay Gaple lengkap (28 kartu, aturan standar Indonesia)
- 4 karakter 2D unik (SVG art, tanpa gambar eksternal)
- 4 skin kartu domino
- 4 power-up (Shuffle, Peek, Block, Double Coin)
- Bot AI 2 level (Easy, Hard)
- Mode Duel 1v1 dan 4 Pemain
- Sistem coin virtual + shop + inventory
- Daily login bonus + daily mission + achievement
- Leaderboard global & mingguan (Redis cache)
- In-game chat + emoji
- Responsive (desktop + mobile)
- Microservices backend (Login, Matchmaking, Chat, Ranking, User)
- MySQL Primary-Replica + Redis Cache
- Docker + Nginx Load Balancer

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JS + GSAP |
| Backend | Node.js + Express + Socket.io |
| Database | MySQL 8.0 (Primary + Replica) |
| Cache | Redis 7 |
| Infrastructure | Docker + Nginx |
| Auth | JWT (jsonwebtoken + bcryptjs) |

## Quick Start

### Frontend (tanpa backend)
```bash
npx serve . -p 5500
# Buka http://localhost:5500
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env sesuai konfigurasi
node server.js
```

### Docker (semua sekaligus)
```bash
cd docker
docker compose up --build
# Buka http://localhost
```

## Struktur Proyek

```
gaple-royale/
├── index.html              ← Entry point frontend
├── css/                    ← Design system & styles
├── js/                     ← Frontend modules
│   ├── pages/              ← Halaman SPA
│   ├── game/               ← Game engine
│   ├── components/         ← UI components
│   └── utils/              ← Helpers
├── backend/                ← Node.js microservices
│   ├── services/           ← Business logic
│   ├── routes/             ← API endpoints
│   ├── middleware/         ← Auth & rate limiting
│   └── models/             ← Database connection
├── docker/                 ← Docker & infrastructure
│   ├── docker-compose.yml
│   ├── nginx/nginx.conf
│   └── mysql/init.sql
└── docs/                   ← Dokumentasi
```

## Dokumentasi

- [PRD Lengkap](PRD-GAPLE-ROYALE.md)
- [Design System](DESIGN-SYSTEM.md)
- [API Documentation](API-DOCUMENTATION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deploy Guide](docs/DEPLOY.md)

## Dibuat Untuk

Proyek Kuliah **Sistem Terdistribusi** — Mini Multiplayer Game Backend

---

*Gaple Royale — Meja Terbaik, Taruhan Terbesar*
