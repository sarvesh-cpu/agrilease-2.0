// ─── User Routes with JWT Authentication ─────────────────────────
const express = require('express');
const router = express.Router();
const db = require('../db');
const { generateToken, requireAuth } = require('../middleware/auth');

// POST /api/users/register
router.post('/register', (req, res) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Name, phone, and password are required' });
  }

  // Check if user exists
  db.get('SELECT id FROM users WHERE phone = ?', [phone], (err, existing) => {
    if (existing) {
      return res.status(409).json({ error: 'Phone number already registered. Please log in.' });
    }

    const sql = 'INSERT INTO users (fullName, phone, password, role) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, phone, password, role || 'landowner'], function(err) {
      if (err) {
        console.error('Registration error:', err.message);
        return res.status(500).json({ error: 'Registration failed: ' + err.message });
      }

      const user = { id: this.lastID, name, phone };
      const token = generateToken(user);

      res.status(201).json({
        message: 'Registration successful',
        user: { id: this.lastID, name, phone, email: email || '' },
        token
      });
    });
  });
});

// POST /api/users/login
router.post('/login', (req, res) => {
  const { phone, password, email } = req.body;
  const identifier = phone || email;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Phone/email and password are required' });
  }

  db.get('SELECT * FROM users WHERE phone = ?', [identifier], (err, user) => {
    if (err) return res.status(500).json({ error: 'Login failed' });
    if (!user) return res.status(401).json({ error: 'Invalid phone number or password' });
    if (user.password !== password) return res.status(401).json({ error: 'Invalid phone number or password' });

    const token = generateToken({ id: user.id, name: user.fullName, phone: user.phone });

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.fullName, phone: user.phone, role: user.role },
      token
    });
  });
});

// GET /api/users/me — Get current user profile (protected)
router.get('/me', requireAuth, (req, res) => {
  db.get('SELECT id, fullName as name, phone, role, isVerified FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  });
});

module.exports = router;
