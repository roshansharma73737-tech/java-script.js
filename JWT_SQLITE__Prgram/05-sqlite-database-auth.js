
/**
 * EXAMPLE 5 — JWT auth backed by a REAL SQL database (SQLite)
 * ---------------------------------------------------------------
 * This replaces the in-memory USERS array from the earlier examples
 * with an actual database file (users.db) using SQLite — a real SQL
 * engine that needs no separate server process, which makes it the
 * easiest way to *learn* "JWT + SQL" before moving to a client-server
 * database like MySQL (see Example 6).
 *
 * What's new compared to the earlier examples:
 *   1. CREATE TABLE — the database schema is created with real SQL
 *   2. REGISTER endpoint — new users are INSERTed, password is HASHED
 *      with bcrypt before it's ever stored (never store plain text!)
 *   3. LOGIN endpoint — SELECTs the user row by username, then compares
 *      the submitted password against the stored hash
 *   4. The JWT payload only contains non-sensitive fields (id, username, role)
 *
 * Requirements:
 *   npm install better-sqlite3 bcryptjs jsonwebtoken express
 *
 * Run:
 *   node 05-sqlite-database-auth.js
 *   -> creates ./users.db automatically on first run
 */
 
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
 
const app = express();
app.use(express.json());
 
const SECRET_KEY = process.env.JWT_SECRET || 'demo-secret-change-me';
 
// ---------- 1. CONNECT to (or create) the database file ----------
const db = new Database('users.db');
 
// ---------- 2. CREATE THE TABLE (real SQL, runs once) ----------
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'user',
    created_at    TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('Database ready: users.db (table "users" created if it did not exist)');
 
// ---------- 3. REGISTER: hash the password, INSERT a new row ----------
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
 
  try {
    // Never store the raw password — hash it with bcrypt (salted automatically)
    const passwordHash = await bcrypt.hash(password, 10);
 
    const stmt = db.prepare(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)'
    );
    const result = stmt.run(username, passwordHash, 'user');
 
    res.status(201).json({ message: 'User registered', userId: result.lastInsertRowid });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username already taken' });
    }
    res.status(500).json({ error: 'Registration failed', detail: err.message });
  }
});
 
// ---------- 4. LOGIN: SELECT the row, compare password, issue JWT ----------
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
 
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
 
  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
 
  // Payload only gets safe, non-sensitive fields — never the password hash!
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: '2h' }
  );
 
  res.json({ message: 'Login successful', token });
});
 
// ---------- 5. MIDDLEWARE: verify JWT ----------
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
 
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}
 
// ---------- 6. PROTECTED ROUTE: proves the DB + JWT are connected ----------
// It re-reads the user from the database using the id stored inside
// the token — showing that the token is just a "key" back to real data.
app.get('/profile', requireAuth, (req, res) => {
  const freshUser = db
    .prepare('SELECT id, username, role, created_at FROM users WHERE id = ?')
    .get(req.user.userId);
 
  if (!freshUser) return res.status(404).json({ error: 'User no longer exists' });
  res.json({ message: `Welcome ${freshUser.username}!`, user: freshUser });
});
 
// ---------- Bonus: list all registered usernames (for demo visibility only) ----------
app.get('/debug/all-users', (req, res) => {
  const rows = db.prepare('SELECT id, username, role, created_at FROM users').all();
  res.json(rows);
});
 
const PORT = 3004;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
 
