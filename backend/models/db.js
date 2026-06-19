const mysql = require('mysql2/promise');

const primaryPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS ?? 'rootpass',
  database: process.env.DB_NAME || 'gaple_royale',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const replicaPool = mysql.createPool({
  host: process.env.DB_REPLICA_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_REPLICA_PORT || process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS ?? 'rootpass',
  database: process.env.DB_NAME || 'gaple_royale',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  primary: primaryPool,
  replica: replicaPool,
  query: (sql, params) => primaryPool.execute(sql, params),
  readQuery: (sql, params) => replicaPool.execute(sql, params)
};
