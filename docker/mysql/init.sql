CREATE DATABASE IF NOT EXISTS gaple_royale;
USE gaple_royale;

CREATE TABLE users (
  id            VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  username      VARCHAR(20) NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  coin          INT NOT NULL DEFAULT 1000,
  active_character VARCHAR(50) DEFAULT 'raja_domino',
  active_skin   VARCHAR(50) DEFAULT 'classic',
  last_login    DATETIME,
  login_streak  INT DEFAULT 0,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

CREATE TABLE user_inventory (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    VARCHAR(36) NOT NULL,
  item_id    VARCHAR(50) NOT NULL,
  item_type  ENUM('character','skin','powerup') NOT NULL,
  quantity   INT DEFAULT 1,
  purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_item (user_id, item_id),
  INDEX idx_user_inventory (user_id)
);

CREATE TABLE game_sessions (
  id          VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  room_id     VARCHAR(10) NOT NULL UNIQUE,
  mode        ENUM('duel','fourplayer') NOT NULL,
  status      ENUM('waiting','active','finished') DEFAULT 'waiting',
  winner_id   VARCHAR(36),
  started_at  DATETIME,
  finished_at DATETIME,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_room_id (room_id),
  INDEX idx_status (status)
);

CREATE TABLE game_players (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  session_id  VARCHAR(36) NOT NULL,
  user_id     VARCHAR(36) NOT NULL,
  position    TINYINT NOT NULL,
  final_score INT DEFAULT 0,
  cards_left  INT DEFAULT 0,
  joined_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_player_session (session_id, user_id)
);

CREATE TABLE transactions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  type        ENUM('earn','spend') NOT NULL,
  amount      INT NOT NULL,
  reason      VARCHAR(100) NOT NULL,
  balance_after INT NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_transactions (user_id)
);

CREATE TABLE chat_messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL,
  user_id    VARCHAR(36) NOT NULL,
  message    VARCHAR(500) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  INDEX idx_session_chat (session_id, created_at)
);

CREATE TABLE achievements (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_achievement (user_id, achievement_id)
);

CREATE TABLE daily_missions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  mission_date DATE NOT NULL,
  mission_id  VARCHAR(50) NOT NULL,
  progress    INT DEFAULT 0,
  target      INT NOT NULL,
  completed   BOOLEAN DEFAULT FALSE,
  claimed     BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_mission (user_id, mission_date, mission_id)
);

CREATE VIEW leaderboard_global AS
  SELECT u.id, u.username, u.active_character,
    COUNT(CASE WHEN gs.winner_id = u.id THEN 1 END) as wins,
    COUNT(gp.id) as total_games,
    ROUND(COALESCE(COUNT(CASE WHEN gs.winner_id = u.id THEN 1 END) / NULLIF(COUNT(gp.id), 0) * 100, 0), 1) as win_rate
  FROM users u
  LEFT JOIN game_players gp ON u.id = gp.user_id
  LEFT JOIN game_sessions gs ON gp.session_id = gs.id
  GROUP BY u.id
  ORDER BY wins DESC;
