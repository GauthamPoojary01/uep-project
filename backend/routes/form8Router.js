//  backend/routes/form8Router.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const {
      school_id,
      total_departments,
      total_institutions,
      total_corporate,
      total_national,
      total_international,
      total_mou_activities,
      current_year,
    } = req.body;

    const total_mous =
      parseInt(total_institutions || 0) +
      parseInt(total_corporate || 0) +
      parseInt(total_national || 0) +
      parseInt(total_international || 0);

    const [existing] = await db.query('SELECT * FROM mous WHERE school_id = ?', [school_id]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE mous SET 
          total_no_of_instiution = ?,
          total_no_of_industry = ?,
          total_no_of_corporate_house = ?,
          total_no_of_national = ?,
          total_no_of_international = ?,
          no_of_activities_in_associated_with_mous = ?,
          current_year = ?,
          mous = ?
        WHERE school_id = ?`,
        [
          total_institutions,
          0,
          total_corporate,
          total_national,
          total_international,
          total_mou_activities,
          current_year,
          total_mous,
          school_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO mous (
          school_id,
          total_no_of_instiution,
          total_no_of_industry,
          total_no_of_corporate_house,
          total_no_of_national,
          total_no_of_international,
          no_of_activities_in_associated_with_mous,
          current_year,
          mous
        ) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?)`,
        [
          school_id,
          total_institutions,
          0,
          total_corporate,
          total_national,
          total_international,
          total_mou_activities,
          current_year,
          total_mous
        ]
      );
    }

    res.status(200).json({ message: 'Form 8 data saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving Form 8 data' });
  }
});

// ✅ GET: Form 8 by school_id
router.get('/:school_id', async (req, res) => {
  try {
    const { school_id } = req.params;
    const [result] = await db.query('SELECT * FROM mous WHERE school_id = ?', [school_id]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Form 8 data not found' });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching Form 8 data' });
  }
});

module.exports = router;