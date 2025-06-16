// backend/routes/form14Router.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Save or Update Form14
router.post('/form14', async (req, res) => {
  try {
    const {
      sid,
      graduating,
      placements,
      higher_studies,
      details_link,
      currennt_year,
      status
    } = req.body;

    const [existing] = await db.query('SELECT * FROM placement_and_highereducation WHERE sid = ?', [sid]);

    if (existing.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE placement_and_highereducation SET 
          graduating = ?,
          placed = ?,
          higher_education = ?,
          link_of_the_details = ?,
          current_year = ?,
          status = ?
        WHERE sid = ?`,
        [
          graduating,
          placements,
          higher_studies,
          details_link,
          currennt_year,
          status,
          sid
        ]
      );
    } else {
      // Insert new record
      await db.query(
        `INSERT INTO placement_and_highereducation (
          sid,
          graduating,
          placed,
          higher_education,
          link_of_the_details,
          current_year,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          sid,
          graduating,
          placements,
          higher_studies,
          details_link,
          currennt_year,
          status
        ]
      );
    }

    res.status(200).json({ message: 'Form 14 data saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving Form 14 data' });
  }
});

// Get Form14 by sid
router.get('/form14/:sid', async (req, res) => {
  try {
    const { sid } = req.params;
    const [result] = await db.query('SELECT * FROM placement_and_highereducation WHERE sid = ?', [sid]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Form 14 data not found' });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching Form 14 data' });
  }
});

module.exports = router;
