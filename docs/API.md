# API Documentation — GAPLE ROYALE
### REST API + WebSocket · v1.0.0

Base URL: `http://localhost:3000/api/v1`

Lihat dokumentasi lengkap di [API-DOCUMENTATION.md](../API-DOCUMENTATION.md)

## Quick Reference

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/auth/register` | - | Daftar akun baru |
| POST | `/auth/login` | - | Login |
| POST | `/auth/logout` | Bearer | Logout |
| GET | `/auth/me` | Bearer | Data user login |
| GET | `/users/:id` | - | Profil publik |
| GET | `/users/:id/inventory` | Bearer | Inventori |
| POST | `/users/:id/inventory/purchase` | Bearer | Beli item |
| PUT | `/users/:id/character` | Bearer | Ganti karakter |
| PUT | `/users/:id/skin` | Bearer | Ganti skin |
| GET | `/users/:id/stats` | - | Statistik |
| POST | `/users/:id/daily-login` | Bearer | Klaim login harian |
| GET | `/users/:id/missions` | Bearer | Misi harian |
| POST | `/users/:id/missions/:mid/claim` | Bearer | Klaim reward misi |
| POST | `/matchmaking/create` | Bearer | Buat sesi game |
| GET | `/matchmaking/status/:roomId` | - | Status room |
| DELETE | `/matchmaking/cancel/:roomId` | Bearer | Batalkan pencarian |
| GET | `/ranking/leaderboard` | - | Leaderboard |
| GET | `/ranking/me` | Bearer | Rank user |
| GET | `/chat/:sessionId/history` | Bearer | Riwayat chat |

## WebSocket: `ws://localhost:3000/game/:roomId`

### Client → Server
- `join` — Bergabung ke room
- `play_card` — Mainkan kartu `{ card: [a,b], side: "left"|"right" }`
- `pass` — Pass giliran
- `use_powerup` — Gunakan power-up

### Server → Client
- `game_start` — Game dimulai, terima kartu
- `game_state` — Update state board
- `card_played` — Kartu dimainkan
- `turn_change` — Giliran berubah
- `player_passed` — Pemain pass
- `game_over` — Game selesai
- `error` — Error
