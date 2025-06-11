//backend/routes/form6Router.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Save or Update Form6
router.post('/form6', async (req, res) => {
  try {
    const {
      sid,
      total_faculty,
      gov_projects,
      non_gov_projects,
      mjes_projects,
      gov_amount,
      non_gov_amount,
      mjes_amount,
      currennt_year,
      status
    } = req.body;

    const [existing] = await db.query('SELECT * FROM research_projects WHERE sid = ?', [sid]);

    if (existing.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE research_projects SET 
          faculties_involved = ?,
          government_category = ?,
          total_amount_for_government_category = ?,
          non_government_category = ?,
          total_amount_for_non_government_category = ?,
          mjes = ?,
          total_amount_for_mjes = ?,
          current_year = ?,
          status = ?
        WHERE sid = ?`,
        [
          total_faculty,
          gov_projects,
          gov_amount,
          non_gov_projects,
          non_gov_amount,
          mjes_projects,
          mjes_amount,
          currennt_year,
          status,
          sid
        ]
      );
    } else {
      // Insert new record
      await db.query(
        `INSERT INTO research_projects (
          sid,
          faculties_involved,
          government_category,
          total_amount_for_government_category,
          non_government_category,
          total_amount_for_non_government_category,
          mjes,
          total_amount_for_mjes,
          current_year,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sid,
          total_faculty,
          gov_projects,
          gov_amount,
          non_gov_projects,
          non_gov_amount,
          mjes_projects,
          mjes_amount,
          currennt_year,
          status
        ]
      );
    }

    res.status(200).json({ message: 'Form 6 data saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving Form 6 data' });
  }
});

// Get Form6 by sid
router.get('/form6/:sid', async (req, res) => {
  try {
    const { sid } = req.params;
    const [result] = await db.query('SELECT * FROM research_projects WHERE sid = ?', [sid]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Form 6 data not found' });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching Form 6 data' });
  }
});

module.exports = router;
