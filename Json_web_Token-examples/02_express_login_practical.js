const express = require('express');
const jwt = require('jsonwebtoken');
 
const app = express();
app.use(express.json());
 
const SECRET_KEY = process.env.JWT_SECRET || 'demo-secret-change-me';
 
// Pretend "database" of users (passwords should be hashed with bcrypt in real apps)
const USERS = [
  { id: 1, username: 'aisha', password: '1234', role: 'user' },
  { id: 2, username: 'admin', password: 'adminpass', role: 'admin' },
];
 
// ---------- 1. LOGIN ROUTE: issues the JWT ----------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
 
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
 
  // Only put non-sensitive claims in the payload — it's readable by anyone
  // who has the token (it's signed, not encrypted).
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: '2h' }
  );
 
  res.json({ message: 'Login successful', token });
});
 
// ---------- 2. MIDDLEWARE: verifies the JWT on protected routes ----------
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization']; // "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
 
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
 
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded; // attach decoded payload to the request
    next();
  });
}
 
// ---------- 3. PROTECTED ROUTE: only reachable with a valid token ----------
app.get('/profile', requireAuth, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}!`,
    yourData: req.user,
  });
});
 
// ---------- PUBLIC ROUTE for comparison ----------
app.get('/public', (req, res) => {
  res.json({ message: 'Anyone can see this, no token needed' });
});
 
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
 