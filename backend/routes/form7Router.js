//backend/routes/form7Router.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET existing form data for a school
router.get('/:sid', async (req, res) => {
  const { sid } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM consultancy WHERE sid = ?', [sid]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST to save or submit form data
router.post('/', async (req, res) => {
  const {
    sid,
    total_faculty,
    total_consultancies,
    total_beneficiaries,
    total_revenue,
    current_year,
    status
  } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM consultancy WHERE sid = ?', [sid]);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE consultancy SET 
          faculties_involved = ?, 
          total_no_of_consultancies = ?, 
          total_no_of_beneficiaries = ?, 
          revenue_generated = ?, 
          current_year = ?, 
          status = ? 
        WHERE sid = ?`,
        [
          total_faculty,
          total_consultancies,
          total_beneficiaries,
          total_revenue,
          current_year,
          status,
          sid
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO consultancy (
          sid,
          faculties_involved,
          total_no_of_consultancies,
          total_no_of_beneficiaries,
          revenue_generated,
          current_year,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          sid,
          total_faculty,
          total_consultancies,
          total_beneficiaries,
          total_revenue,
          current_year,
          status
        ]
      );
    }

    res.status(200).json({ message: 'Form saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
