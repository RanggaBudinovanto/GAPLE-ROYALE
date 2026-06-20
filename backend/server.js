require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use('/api/v1', apiLimiter);

app.use('/api/v1/auth',        require('./routes/auth.routes'));
app.use('/api/v1/users',       require('./routes/user.routes'));
app.use('/api/v1/matchmaking', require('./routes/matchmaking.routes'));
app.use('/api/v1/ranking',     require('./routes/ranking.routes'));
app.use('/api/v1',             require('./routes/game.routes'));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/debug-db', async (req, res) => {
  try {
    const db = require('./models/db');
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    const [tables] = await db.query('SHOW TABLES');
    res.json({
      success: true,
      env: {
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT
      },
      solution: rows[0].solution,
      tables: tables
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.name || 'Error',
      message: err.message,
      stack: err.stack,
      env: {
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT
      }
    });
  }
});


// Serve static frontend files from parent directory
const path = require('path');
app.use(express.static(path.join(__dirname, '..')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/socket.io/') || req.path.startsWith('/game/')) return next();
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Wire Socket.io instance into matchmaking service for real-time room notifications
const matchmakingService = require('./services/matchmaking.service');
matchmakingService.setIO(io);

// Initialize game socket service
require('./services/game.service')(io);

// Auto-initialize database tables if they don't exist
async function autoInitDatabase() {
  const db = require('./models/db');
  const fs = require('fs');
  const path = require('path');
  
  try {
    console.log('Checking if database tables exist...');

    // Check and add Ranked column modifications dynamically if missing
    try {
      const [userCols] = await db.query("SHOW COLUMNS FROM users LIKE 'rank_points'");
      if (userCols.length === 0) {
        console.log('Adding column "rank_points" to "users" table...');
        await db.query("ALTER TABLE users ADD COLUMN rank_points INT DEFAULT 0");
      }
    } catch (colErr) {
      console.warn('Failed to check/add users.rank_points:', colErr.message);
    }

    try {
      const [sessionCols] = await db.query("SHOW COLUMNS FROM game_sessions LIKE 'is_ranked'");
      if (sessionCols.length === 0) {
        console.log('Adding column "is_ranked" to "game_sessions" table...');
        await db.query("ALTER TABLE game_sessions ADD COLUMN is_ranked BOOLEAN DEFAULT FALSE");
      }
    } catch (colErr) {
      console.warn('Failed to check/add game_sessions.is_ranked:', colErr.message);
    }
    // Check if "users" table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.log('Table "users" not found. Initializing database schema...');
      
      const sqlPath = path.join(__dirname, '..', 'docker', 'mysql', 'init.sql');
      if (fs.existsSync(sqlPath)) {
        let schema = fs.readFileSync(sqlPath, 'utf8');
        
        // Remove CREATE DATABASE and USE statements because Railway already manages the database
        schema = schema.replace(/CREATE DATABASE[\s\S]*?USE[\s\S]*?;/i, '');
        
        const statements = schema
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const stmt of statements) {
          try {
            await db.query(stmt);
          } catch (err) {
            console.warn(`Warning executing stmt: ${err.message}`);
          }
        }
        console.log('✅ Database schema initialized successfully!');
      } else {
        console.error(`Schema file not found at ${sqlPath}`);
      }
    } else {
      console.log('Database tables already exist.');
    }
  } catch (err) {
    console.error('Failed to auto-initialize database:', err.message);
  }
}

const PORT = process.env.PORT || 3000;
autoInitDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Gaple Royale Backend running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});

