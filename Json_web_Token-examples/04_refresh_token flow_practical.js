
 
const express = require('express');
const jwt = require('jsonwebtoken');
 
const app = express();
app.use(express.json());
 
const ACCESS_SECRET = 'access-secret-demo';
const REFRESH_SECRET = 'refresh-secret-demo';
 
// In production, store refresh tokens in a DB so they can be revoked
// (e.g. on logout, or if the user's account is compromised).
let validRefreshTokens = new Set();
 
const USERS = [{ id: 1, username: 'aisha', password: '1234' }];
 
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
 
  const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: '15s' }); // short!
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
 
  validRefreshTokens.add(refreshToken);
  res.json({ accessToken, refreshToken });
});
 
app.get('/data', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No access token' });
 
  jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Access token expired or invalid, call /refresh' });
    res.json({ message: 'Here is your protected data', userId: decoded.userId });
  });
});
 
// Exchange a valid refresh token for a NEW access token
app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !validRefreshTokens.has(refreshToken)) {
    return res.status(403).json({ error: 'Refresh token invalid or revoked, please log in again' });
  }
 
  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Refresh token expired, please log in again' });
    const newAccessToken = jwt.sign({ userId: decoded.userId }, ACCESS_SECRET, { expiresIn: '15s' });
    res.json({ accessToken: newAccessToken });
  });
});
 
// Logout revokes the refresh token so it can never be used again
app.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  validRefreshTokens.delete(refreshToken);
  res.json({ message: 'Logged out, refresh token revoked' });
});
 
const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));