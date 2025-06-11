//backend/routes/form8Router.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// Get existing data for a school (by sid)
router.get('/:sid', (req, res) => {
  const sid = req.params.sid;
  const query = 'SELECT * FROM mous WHERE sid = ?';
  db.query(query, [sid], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'No data found' });
    return res.json(results[0]);
  });
});

// Insert or update form8 (MOUs)
router.post('/', (req, res) => {
  const {
    sid,
    total_departments, // Not in DB, skip
    total_institutions,
    total_corporate,
    total_national,
    total_international,
    total_mou_activities,
    current_year,
    status
  } = req.body;

  const total_mous = parseInt(total_institutions || 0) +
                     parseInt(total_corporate || 0) +
                     parseInt(total_national || 0) +
                     parseInt(total_international || 0);

  const checkQuery = 'SELECT * FROM mous WHERE sid = ?';
  db.query(checkQuery, [sid], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database check error' });

    const data = {
      total_no_of_instiution: total_institutions,
      total_no_of_industry: 0, // not used, keep 0
      total_no_of_corporate_house: total_corporate,
      total_no_of_national: total_national,
      total_no_of_international: total_international,
      no_of_activities_in_associated_with_mous: total_mou_activities,
      current_year,
      status,
      mous: total_mous
    };

    if (results.length > 0) {
      // Update
      const updateQuery = `UPDATE mous SET ? WHERE sid = ?`;
      db.query(updateQuery, [data, sid], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database update error' });
        return res.json({ message: 'Form 8 updated successfully' });
      });
    } else {
      // Insert
      const insertQuery = `INSERT INTO mous SET sid = ?, ?`;
      db.query(insertQuery, [sid, data], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database insert error' });
        return res.json({ message: 'Form 8 submitted successfully' });
      });
    }
  });
});

module.exports = router;
