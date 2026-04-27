const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/lands — Get all land profiles
router.get('/', (req, res) => {
  db.all(
    `SELECT * FROM land_profiles ORDER BY createdAt DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch land profiles' });
      res.json(rows);
    }
  );
});

// GET /api/lands/:id — Get single land profile
router.get('/:id', (req, res) => {
  db.get(
    `SELECT * FROM land_profiles WHERE id = ?`,
    [req.params.id],
    (err, row) => {
      if (err || !row) return res.status(404).json({ error: 'Land profile not found' });
      res.json(row);
    }
  );
});

// POST /api/lands — Create new land profile
router.post('/', (req, res) => {
  const { userId, name, district, taluka, area, soilType, irrigationType, previousCrop, season } = req.body;
  
  if (!district || !soilType || !irrigationType || !season) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  db.run(
    `INSERT INTO land_profiles (userId, name, district, taluka, area, soilType, irrigationType, previousCrop, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId || null, name || 'My Land', district, taluka || '', parseFloat(area) || 5, soilType, irrigationType, previousCrop || '', season],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to save land profile' });
      res.json({ id: this.lastID, message: 'Land profile created' });
    }
  );
});

// DELETE /api/lands/:id — Delete a land profile
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM land_profiles WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete' });
    res.json({ message: 'Deleted', changes: this.changes });
  });
});

module.exports = router;
