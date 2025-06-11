// backend/routes/form9router.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET form9 data by SID
router.get('/:sid', async (req, res) => {
  const sid = req.params.sid;
  try {
    const [rows] = await pool.query('SELECT * FROM school_activites WHERE sid = ?', [sid]);
    if (rows.length === 0) return res.status(404).json({ error: 'Data not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST (insert or update) form9 data
router.post('/', async (req, res) => {
  const {
    total_guest_talks,
    total_alumni_interactions,
    total_industrial_visits,
    total_study_tours,
    total_fests,
    total_fdps,
    total_edps,
    total_mdps,
    total_conferences,
    total_workshops,
    total_national_seminars,
    total_ipr_events,
    total_research_methodology_events,
    total_entrepreneurship_events,
    total_skill_development_events,
    status,
  } = req.body;

  const user = JSON.parse(req.headers["user"] || '{}');
  const sid = user.sid;
  const current_year = new Date().getFullYear();

  if (!sid) return res.status(400).json({ error: 'SID missing' });

  try {
    await pool.query(
      `REPLACE INTO school_activites (
        sid,
        no_of_guest_talk,
        no_of_alumni_interaction,
        no_of_industrial_visit,
        no_of_study_tour,
        no_of_fests,
        no_of_fdp,
        no_of_mdp,
        no_of_conferences,
        no_of_workshop,
        no_of_national_seminars,
        seminars_related_to_intellectual_property_rights,
        research_methodology,
        entrepreneurship,
        skill_development,
        current_year,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sid,
        total_guest_talks,
        total_alumni_interactions,
        total_industrial_visits,
        total_study_tours,
        total_fests,
        total_fdps,
        total_mdps,
        total_conferences,
        total_workshops,
        total_national_seminars,
        total_ipr_events,
        total_research_methodology_events,
        total_entrepreneurship_events,
        total_skill_development_events,
        current_year,
        status || 'saved'
      ]
    );
    res.json({ message: 'Form 9 data saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
