# Arsitektur Sistem — GAPLE ROYALE

## Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                     NGINX LOAD BALANCER                     │
│                    (Port 80, Least Conn)                    │
└────────────┬─────────────────────────────────┬──────────────┘
             │                                 │
    ┌────────▼────────┐               ┌────────▼────────┐
    │  API Gateway    │               │  API Gateway    │
    │  Instance 1     │               │  Instance 2     │
    │  Port 3000      │               │  Port 3001      │
    └────────┬────────┘               └────────┬────────┘
             │                                 │
    ┌────────▼─────────────────────────────────▼────────┐
    │               INTERNAL SERVICE MESH                │
    ├────────────────┬───────────────────────────────────┤
    │  Login Service │ Matchmaking  │ Chat    │ Ranking  │
    │  Port 4001     │ Service 4002 │ 4003    │ 4004     │
    └────────────────┴───────────┬──┴─────────┴──────────┘
                                 │
                        ┌────────▼────────────────┐
                        │    User Service          │
                        │    Port 4005             │
                        └────────┬────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
    ┌─────────▼──────┐  ┌────────▼──────┐  ┌───────▼────────┐
    │  MySQL Primary │  │ MySQL Replica │  │  Redis Cache   │
    │  Port 3306     │  │  Port 3307    │  │  Port 6379     │
    └────────────────┘  └───────────────┘  └────────────────┘
```

## Microservices

| Service | Port | Tanggung Jawab |
|---------|------|----------------|
| Login Service | 4001 | Register, Login, JWT, Logout |
| Matchmaking Service | 4002 | Buat room, cari lawan, match PvP |
| Chat Service | 4003 | WebSocket chat in-game, history |
| Ranking Service | 4004 | Leaderboard global/weekly, Redis cache |
| User Service | 4005 | Profil, inventory, coin, achievement, misi |

## Teknologi

- **Backend**: Node.js + Express
- **Realtime**: Socket.io (WebSocket)
- **Database**: MySQL 8.0 (Primary + Replica)
- **Cache**: Redis 7
- **Load Balancer**: Nginx (Least Connection)
- **Container**: Docker + Docker Compose
- **Auth**: JWT (jsonwebtoken + bcryptjs)

## Database Replication

MySQL menggunakan konfigurasi Primary-Replica:
- **Primary** (Port 3306): Semua operasi WRITE (INSERT, UPDATE, DELETE)
- **Replica** (Port 3307): Operasi READ (SELECT untuk leaderboard, profil publik)

## Two-Phase Commit (2PC)

Transaksi coin menggunakan simulasi 2PC:
1. **Phase Prepare**: Lock user row, cek saldo cukup
2. **Phase Commit**: Kurangi coin + tambah item + catat transaksi (dalam satu transaction)
3. **Rollback**: Jika gagal di fase manapun, semua dibatalkan

## Redis Cache

- Leaderboard di-cache dengan TTL 5 menit
- Cache key format: `leaderboard:{type}:{page}:{limit}`
- Cache invalidation otomatis setelah TTL expired
