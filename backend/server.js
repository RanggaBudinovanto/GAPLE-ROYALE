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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Gaple Royale Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
