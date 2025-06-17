// backend/routes/form1Router.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Save or update form1 data
router.post('/save', async (req, res) => {
  const {
    sid,
    year,
    total_faculty,
    phd_holders,
    net_kset,
    without_phd_kset,
    pursuing_phd
  } = req.body;

  if (!sid) {
    return res.status(400).json({ message: 'sid is required' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM school_profile WHERE sid = ?', [sid]);

    if (existing.length > 0) {
      await db.query(`
        UPDATE school_profile
        SET current_year = ?,
            no_of_faculties = ?,
            no_of_phd = ?,
            no_of_net_kset = ?,
            no_of_without_phd_kset_net = ?,
            no_of_pursuing_phd = ?
        WHERE sid = ?
      `, [
        year,
        total_faculty,
        phd_holders,
        net_kset,
        without_phd_kset,
        pursuing_phd,
        sid
      ]);
    } else {
      await db.query(`
        INSERT INTO school_profile (
          sid,
          current_year,
          no_of_faculties,
          no_of_phd,
          no_of_net_kset,
          no_of_without_phd_kset_net,
          no_of_pursuing_phd,
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        sid,
        year,
        total_faculty,
        phd_holders,
        net_kset,
        without_phd_kset,
        pursuing_phd
      ]);
    }

    res.status(200).json({ message: 'Form 1 data saved successfully' });
  } catch (err) {
    console.error('Error saving form 1 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit form1
router.post('/submit', async (req, res) => {
  const { sid } = req.body;
  if (!sid) return res.status(400).json({ message: 'sid is required' });

  try {
    await db.query('UPDATE school_profile SET status = ? WHERE sid = ?', ['submitted', sid]);
    res.status(200).json({ message: 'Form 1 submitted successfully' });
  } catch (err) {
    console.error('Error submitting form 1:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get form1 data
router.get('/', async (req, res) => {
  const sid = req.query.sid;
  if (!sid) return res.status(400).json({ message: 'sid is required' });

  try {
    const [rows] = await db.query('SELECT * FROM school_profile WHERE sid = ?', [sid]);
    if (rows.length === 0) return res.status(404).json({ message: 'No data found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching form 1 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
