# API Documentation — GAPLE ROYALE
### REST API + WebSocket · v1.0.0

---

## Base URL

```
Production: https://your-domain.railway.app/api/v1
Development: http://localhost:3000/api/v1
WebSocket:   ws://localhost:3000
```

## Authentication

Semua endpoint yang butuh auth wajib menyertakan header:
```
Authorization: Bearer <JWT_TOKEN>
```

Token didapat dari endpoint `POST /auth/login` atau `POST /auth/register`.  
Token expired setelah **24 jam**. Refresh dengan login ulang.

---

## Auth Service (Login Service)

### POST `/auth/register`
Mendaftarkan akun baru. Tidak butuh auth token.

**Request Body:**
```json
{
  "username": "string (3-20 char, alfanumerik)",
  "email": "string (format email valid)",
  "password": "string (min 6 char)"
}
```

**Response 201:**
```json
{
  "token": "gaple.eyJ1c2VySWQiOiJ1dWlkIn0=.simulasi",
  "user": {
    "id": "uuid-string",
    "username": "player123",
    "email": "player@email.com",
    "coin": 1000,
    "activeCharacter": "raja_domino",
    "activeSkin": "classic",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response 400:**
```json
{ "error": "USERNAME_TAKEN",    "message": "Username sudah digunakan" }
{ "error": "EMAIL_TAKEN",       "message": "Email sudah terdaftar" }
{ "error": "VALIDATION_ERROR",  "message": "Username hanya boleh alfanumerik" }
```

---

### POST `/auth/login`
Login dengan username dan password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response 200:**
```json
{
  "token": "gaple.eyJ1c2VySWQiOiJ1dWlkIn0=.simulasi",
  "user": {
    "id": "uuid-string",
    "username": "player123",
    "coin": 2500,
    "activeCharacter": "si_hoki",
    "activeSkin": "royal_gold",
    "loginStreak": 5,
    "lastLogin": "2024-01-14T08:00:00Z"
  }
}
```

**Response 401:**
```json
{ "error": "INVALID_CREDENTIALS", "message": "Username atau password salah" }
```

---

### POST `/auth/logout`
Invalidate token. Butuh auth.

**Response 200:**
```json
{ "success": true }
```

---

### GET `/auth/me`
Ambil data user yang sedang login. Butuh auth.

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "username": "player123",
    "email": "player@email.com",
    "coin": 2500,
    "activeCharacter": "si_hoki",
    "activeSkin": "royal_gold",
    "loginStreak": 5,
    "lastLogin": "2024-01-14T08:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Response 401:**
```json
{ "error": "UNAUTHORIZED", "message": "Token tidak valid atau expired" }
```

---

## User Service

### GET `/users/:userId`
Ambil profil publik pemain.

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "username": "player123",
    "activeCharacter": "raja_domino",
    "createdAt": "2024-01-01T00:00:00Z",
    "stats": {
      "wins": 42,
      "losses": 18,
      "totalGames": 60,
      "winRate": 70.0,
      "totalCoinEarned": 15000,
      "longestStreak": 8
    },
    "achievements": [
      { "id": "first_win", "unlockedAt": "2024-01-02T10:00:00Z" },
      { "id": "domino_master", "unlockedAt": "2024-01-10T15:30:00Z" }
    ]
  }
}
```

**Response 404:**
```json
{ "error": "USER_NOT_FOUND" }
```

---

### GET `/users/:userId/inventory`
Ambil inventori pemain. Butuh auth (hanya user sendiri).

**Response 200:**
```json
{
  "inventory": [
    { "itemId": "raja_domino", "itemType": "character", "quantity": 1 },
    { "itemId": "si_hoki",     "itemType": "character", "quantity": 1 },
    { "itemId": "classic",     "itemType": "skin",      "quantity": 1 },
    { "itemId": "shuffle",     "itemType": "powerup",   "quantity": 5 },
    { "itemId": "peek",        "itemType": "powerup",   "quantity": 2 }
  ]
}
```

---

### POST `/users/:userId/inventory/purchase`
Beli item dengan coin. Butuh auth (hanya user sendiri).

**Request Body:**
```json
{
  "itemId": "si_hoki",
  "itemType": "character",
  "quantity": 1
}
```

**Response 200:**
```json
{
  "success": true,
  "newBalance": 1700,
  "purchasedItem": {
    "itemId": "si_hoki",
    "itemType": "character",
    "quantity": 1
  }
}
```

**Response 402:**
```json
{
  "error": "INSUFFICIENT_COIN",
  "message": "Coin tidak cukup",
  "required": 800,
  "current": 500,
  "shortfall": 300
}
```

**Response 400:**
```json
{ "error": "ITEM_NOT_FOUND",    "message": "Item tidak ditemukan" }
{ "error": "ALREADY_OWNED",     "message": "Item sudah dimiliki" }
{ "error": "MAX_STOCK_REACHED", "message": "Stok power-up sudah maksimum (99)" }
```

---

### PUT `/users/:userId/character`
Ganti karakter aktif. Butuh auth.

**Request Body:**
```json
{ "characterId": "si_hoki" }
```

**Response 200:**
```json
{ "success": true, "activeCharacter": "si_hoki" }
```

**Response 403:**
```json
{ "error": "ITEM_NOT_OWNED", "message": "Karakter belum dimiliki" }
```

---

### PUT `/users/:userId/skin`
Ganti skin kartu aktif. Butuh auth.

**Request Body:**
```json
{ "skinId": "royal_gold" }
```

**Response 200:**
```json
{ "success": true, "activeSkin": "royal_gold" }
```

---

### GET `/users/:userId/stats`
Statistik lengkap pemain.

**Response 200:**
```json
{
  "stats": {
    "wins": 42,
    "losses": 18,
    "totalGames": 60,
    "winRate": 70.0,
    "totalCoinEarned": 15000,
    "longestStreak": 8,
    "currentStreak": 3,
    "powerupsUsed": 25,
    "chatMessagesSent": 87,
    "recentGames": [
      {
        "sessionId": "uuid",
        "mode": "duel",
        "result": "win",
        "coinEarned": 215,
        "playedAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

### POST `/users/:userId/daily-login`
Klaim daily login bonus. Butuh auth. Hanya bisa sekali per hari.

**Response 200:**
```json
{
  "success": true,
  "day": 5,
  "coinReward": 300,
  "newBalance": 2800,
  "loginStreak": 5
}
```

**Response 400:**
```json
{ "error": "ALREADY_CLAIMED", "message": "Bonus hari ini sudah diklaim" }
```

---

### GET `/users/:userId/missions`
Ambil misi harian beserta progress.

**Response 200:**
```json
{
  "date": "2024-01-15",
  "missions": [
    {
      "id": "play_3_rounds",
      "name": "Main 3 Ronde",
      "description": "Selesaikan 3 game hari ini",
      "progress": 2,
      "target": 3,
      "reward": 150,
      "completed": false,
      "claimed": false
    },
    {
      "id": "win_1_game",
      "name": "Menangkan 1 Game",
      "progress": 1,
      "target": 1,
      "reward": 300,
      "completed": true,
      "claimed": false
    },
    {
      "id": "chat_5_messages",
      "name": "Chat 5 Pesan",
      "progress": 3,
      "target": 5,
      "reward": 100,
      "completed": false,
      "claimed": false
    }
  ]
}
```

---

### POST `/users/:userId/missions/:missionId/claim`
Klaim reward misi yang sudah completed. Butuh auth.

**Response 200:**
```json
{ "success": true, "coinReward": 300, "newBalance": 3100 }
```

**Response 400:**
```json
{ "error": "MISSION_NOT_COMPLETED", "message": "Misi belum selesai" }
{ "error": "ALREADY_CLAIMED",       "message": "Reward sudah diklaim" }
```

---

## Matchmaking Service

### POST `/matchmaking/create`
Buat sesi matchmaking baru. Butuh auth.

**Request Body:**
```json
{
  "mode": "duel",
  "opponentType": "bot",
  "botLevel": "hard"
}
```

Untuk PvP:
```json
{
  "mode": "fourplayer",
  "opponentType": "pvp"
}
```

**Response 200:**
```json
{
  "roomId": "GAP-4X2K",
  "sessionId": "uuid-session",
  "wsUrl": "ws://localhost:3000/game/GAP-4X2K",
  "status": "ready"
}
```

**Response 202** (PvP, waiting):
```json
{
  "roomId": "GAP-9Z1M",
  "sessionId": "uuid-session",
  "status": "waiting",
  "message": "Mencari lawan, harap tunggu..."
}
```

---

### GET `/matchmaking/status/:roomId`
Cek status waiting room.

**Response 200:**
```json
{
  "roomId": "GAP-9Z1M",
  "status": "waiting",
  "players": [
    { "userId": "uuid1", "username": "player1", "character": "raja_domino" }
  ],
  "maxPlayers": 2,
  "waitingSeconds": 12
}
```

Status bisa: `"waiting"` | `"ready"` | `"started"` | `"cancelled"`

---

### DELETE `/matchmaking/cancel/:roomId`
Batalkan pencarian lawan. Butuh auth.

**Response 200:**
```json
{ "success": true }
```

---

## Ranking Service

### GET `/ranking/leaderboard`

**Query Params:**
- `type`: `global` (default) | `weekly`
- `page`: integer, default 1
- `limit`: integer, default 20, max 50

**Response 200:**
```json
{
  "type": "global",
  "page": 1,
  "limit": 20,
  "total": 150,
  "cached": true,
  "cacheExpiry": 1705312800000,
  "data": [
    {
      "rank": 1,
      "userId": "uuid",
      "username": "DominoKing",
      "activeCharacter": "juragan_meja",
      "wins": 128,
      "totalGames": 180,
      "winRate": 71.1
    },
    {
      "rank": 2,
      "userId": "uuid2",
      "username": "SiHoki99",
      "activeCharacter": "si_hoki",
      "wins": 95,
      "totalGames": 140,
      "winRate": 67.8
    }
  ]
}
```

---

### GET `/ranking/me`
Posisi user yang login di leaderboard. Butuh auth.

**Response 200:**
```json
{
  "rank": 42,
  "wins": 25,
  "totalGames": 38,
  "winRate": 65.8
}
```

---

## Chat Service

### GET `/chat/:sessionId/history`
Ambil riwayat chat sesi game. Butuh auth.

**Response 200:**
```json
{
  "sessionId": "uuid-session",
  "messages": [
    {
      "id": 1,
      "userId": "uuid-user",
      "username": "player123",
      "content": "Siap main!",
      "timestamp": "2024-01-15T10:05:00Z"
    },
    {
      "id": 2,
      "userId": "bot",
      "username": "Bot Si Hoki",
      "content": "Ayo lanjut 💪",
      "timestamp": "2024-01-15T10:05:02Z"
    }
  ]
}
```

---

## WebSocket Events

### Koneksi Game: `ws://localhost:3000/game/:roomId`

Header: `Authorization: Bearer <token>`

---

### Client → Server Events

**join** — Bergabung ke room
```json
{ "type": "join", "userId": "uuid", "token": "jwt-token" }
```

**ready** — Siap mulai game
```json
{ "type": "ready" }
```

**play_card** — Mainkan kartu
```json
{
  "type": "play_card",
  "card": [3, 5],
  "side": "left"
}
```
`side`: `"left"` | `"right"` (ujung board mana yang disambung)

**pass** — Pass giliran (hanya valid jika tidak ada kartu yang bisa dimainkan)
```json
{ "type": "pass" }
```

**use_powerup** — Gunakan power-up
```json
{
  "type": "use_powerup",
  "powerup": "shuffle"
}
```
`powerup`: `"shuffle"` | `"peek"` | `"block"` | `"double_coin"`

---

### Server → Client Events

**game_start** — Game dimulai
```json
{
  "type": "game_start",
  "hand": [[3,5],[1,1],[0,4],[6,2],[3,3],[5,5],[1,4]],
  "firstTurn": "uuid-player1",
  "players": [
    { "userId": "uuid1", "username": "player1", "character": "raja_domino", "handSize": 7 },
    { "userId": "uuid2", "username": "Bot Easy", "character": "si_hoki",    "handSize": 7 }
  ]
}
```

**game_state** — Update state game
```json
{
  "type": "game_state",
  "board": {
    "left": 3,
    "right": 2,
    "chain": [[3,5],[5,1],[1,2]]
  },
  "turn": "uuid-player2",
  "handSizes": { "uuid1": 6, "uuid2": 7 },
  "timerSeconds": 30
}
```

**card_played** — Kartu dimainkan
```json
{
  "type": "card_played",
  "playerId": "uuid1",
  "card": [3,5],
  "side": "left",
  "newBoard": { "left": 5, "right": 2 }
}
```

**player_passed** — Pemain pass
```json
{
  "type": "player_passed",
  "playerId": "uuid1",
  "reason": "no_valid_moves"
}
```

**turn_change** — Giliran berubah
```json
{
  "type": "turn_change",
  "currentTurn": "uuid2",
  "timerSeconds": 30
}
```

**powerup_used** — Power-up digunakan
```json
{
  "type": "powerup_used",
  "userId": "uuid1",
  "powerup": "peek",
  "target": "uuid2",
  "revealedCard": [4,6]
}
```

**game_over** — Game selesai
```json
{
  "type": "game_over",
  "reason": "hand_empty",
  "winner": "uuid1",
  "scores": [
    { "userId": "uuid1", "username": "player1", "cardsLeft": 0, "totalPip": 0,  "rank": 1 },
    { "userId": "uuid2", "username": "Bot Easy", "cardsLeft": 4, "totalPip": 18, "rank": 2 }
  ],
  "coinEarned": {
    "uuid1": { "base": 200, "winBonus": 200, "passive": 60, "doubleMultiplier": 1, "total": 460 },
    "uuid2": { "base": 30,  "winBonus": 0,   "passive": 0,  "doubleMultiplier": 1, "total": 30  }
  }
}
```

**error** — Error saat game
```json
{
  "type": "error",
  "code": "INVALID_MOVE",
  "message": "Kartu tidak bisa dimainkan di posisi ini"
}
```

Error codes: `INVALID_MOVE` | `NOT_YOUR_TURN` | `POWERUP_NOT_OWNED` | `ROOM_FULL` | `ROOM_NOT_FOUND`

---

## Error Codes Reference

| Code | HTTP | Keterangan |
|---|---|---|
| `USERNAME_TAKEN` | 400 | Username sudah dipakai |
| `EMAIL_TAKEN` | 400 | Email sudah terdaftar |
| `VALIDATION_ERROR` | 400 | Input tidak valid |
| `INVALID_CREDENTIALS` | 401 | Username/password salah |
| `UNAUTHORIZED` | 401 | Token tidak ada atau invalid |
| `TOKEN_EXPIRED` | 401 | Token sudah expired, login ulang |
| `FORBIDDEN` | 403 | Tidak punya akses ke resource ini |
| `ITEM_NOT_OWNED` | 403 | Item belum dimiliki |
| `USER_NOT_FOUND` | 404 | User tidak ditemukan |
| `ITEM_NOT_FOUND` | 404 | Item tidak ditemukan di katalog |
| `INSUFFICIENT_COIN` | 402 | Coin tidak cukup |
| `ALREADY_OWNED` | 400 | Item sudah dimiliki (untuk character/skin) |
| `MAX_STOCK_REACHED` | 400 | Stok power-up sudah maksimum |
| `ALREADY_CLAIMED` | 400 | Daily bonus atau misi sudah diklaim hari ini |
| `MISSION_NOT_COMPLETED` | 400 | Misi belum selesai, tidak bisa klaim |
| `ROOM_NOT_FOUND` | 404 | Room game tidak ditemukan |
| `ROOM_FULL` | 400 | Room sudah penuh |
| `SERVICE_UNAVAILABLE` | 503 | Service sedang tidak tersedia |
