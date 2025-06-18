// backend/routes/form6Router.js
const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/:sid', async (req, res) => {
  const { sid } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM placement_and_highereducation WHERE sid = ?', [sid]);
    if (rows.length > 0) {
      return res.json(rows[0]);
    }
    return res.json(null);
  } catch (error) {
    console.error('Error fetching form6:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save or update form6 data
router.post('/', async (req, res) => {
  const {
    sid,
    graduating,
    placements,
    higher_studies,
  } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM placement_and_highereducation WHERE sid = ?', [sid]);
    if (existing.length > 0) {
      await pool.query(
        `UPDATE placement_and_highereducation SET 
          graduating = ?,
          placed = ?,
          higher_education = ?,
          current_year = YEAR(CURDATE())
        WHERE sid = ?`,
        [
          graduating,
          placements,
          higher_studies,
          sid
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO placement_and_highereducation (
          sid, graduating, placed, higher_education, , current_year
        ) VALUES (?, ?, ?, ?, YEAR(CURDATE()))`,
        [
          sid,
          graduating,
          placements,
          higher_studies,
        ]
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving form6:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
