// backend/routes/form7Router.js
const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/save', async (req, res) => {
  try {
    const {
      school_id,
      total_faculty,
      total_consultancies,
      total_beneficiaries,
      total_revenue,
      current_year
    } = req.body;

    const [existing] = await db.query('SELECT * FROM consultancy WHERE school_id = ?', [school_id]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE consultancy SET 
          faculties_involved = ?, 
          total_no_of_consultancies = ?, 
          total_no_of_beneficiaries = ?, 
          revenue_generated = ?, 
          current_year = ?
        WHERE school_id = ?`,
        [
          total_faculty,
          total_consultancies,
          total_beneficiaries,
          total_revenue,
          current_year,
          school_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO consultancy (
          school_id,
          faculties_involved,
          total_no_of_consultancies,
          total_no_of_beneficiaries,
          revenue_generated,
          current_year
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          school_id,
          total_faculty,
          total_consultancies,
          total_beneficiaries,
          total_revenue,
          current_year
        ]
      );
    }

    await db.query(
      `INSERT INTO form_status (school_id, form_number, status) VALUES (?, 7, 'draft') 
       ON DUPLICATE KEY UPDATE status = 'draft'`,
      [school_id]
    );

    res.status(200).json({ message: 'Form 7 data saved successfully' });
  } catch (err) {
    console.error('Error saving Form 7 data:', err);
    res.status(500).json({ message: 'Error saving Form 7 data' });
  }
});


router.post('/submit', async (req, res) => {
  try {
    const { school_id } = req.body;
    await db.query('UPDATE consultancy SET status = ? WHERE school_id = ?', ['submitted', school_id]);
    await db.query(`INSERT INTO form_status (school_id, form_number, status) VALUES (?, 7, 'submitted') 
      ON DUPLICATE KEY UPDATE status = 'submitted'`, [school_id]);
    res.status(200).json({ message: 'Form 7 submitted successfully' });
  } catch (err) {
    console.error('Error submitting Form 7:', err);
    res.status(500).json({ message: 'Error submitting Form 7' });
  }
});


router.get('/:school_id', async (req, res) => {
  try {
    const { school_id } = req.params;
    const [result] = await db.query('SELECT * FROM consultancy WHERE school_id = ?', [school_id]);
    if (result.length === 0) return res.status(404).json({ message: 'Form 7 data not found' });
    res.status(200).json(result[0]);
  } catch (err) {
    console.error('Error fetching Form 7:', err);
    res.status(500).json({ message: 'Error fetching Form 7' });
  }
});

module.exports = router;
