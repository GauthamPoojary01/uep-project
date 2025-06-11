// backend/routes/form1Routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET form1 data
router.get('/', async (req, res) => {
  const { sid } = req.query;
  if (!sid) return res.status(400).json({ error: 'sid is required' });

  try {
    const [rows] = await db.query('SELECT * FROM school_profile WHERE sid = ?', [sid]);
    if (rows.length === 0) return res.status(404).json({ error: 'No form data found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching form1:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// SAVE (draft)
router.post('/save', async (req, res) => {
  const { sid, data } = req.body;
  if (!sid || !data) return res.status(400).json({ error: 'sid and data are required' });

  try {
    await db.query(`REPLACE INTO school_profile 
      (sid, year_of_establishment, no_of_faculties, no_of_phd, no_of_net_kset, 
      no_of_without_phd_kset_net, no_of_pursuing_phd, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [
        sid,
        data.year,
        data.total_faculty,
        data.phd,
        data.net_kset,
        data.without_quals,
        data.pursuing_phd
      ]);

    res.json({ message: 'Form saved as draft' });
  } catch (err) {
    console.error('Error saving form1:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// SUBMIT (mark as submitted)
router.post('/submit', async (req, res) => {
  const { sid } = req.body;
  if (!sid) return res.status(400).json({ error: 'sid is required' });

  try {
    await db.query('UPDATE school_profile SET status = ? WHERE sid = ?', ['submitted', sid]);
    res.json({ message: 'Form submitted' });
  } catch (err) {
    console.error('Error submitting form1:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
