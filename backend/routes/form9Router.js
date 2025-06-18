// backend/routes/form9Router.js
const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/:sid', async (req, res) => {
  const { sid } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM school_activites WHERE sid = ?', [sid]);
    if (rows.length > 0) {
      return res.json(rows[0]);
    }
    return res.json(null);
  } catch (error) {
    console.error('Error fetching form9:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/', async (req, res) => {
  const {
    sid,
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
  } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM school_activites WHERE sid = ?', [sid]);
    if (existing.length > 0) {
      await pool.query(
        `UPDATE school_activites SET
          no_of_guest_talk = ?,
          no_of_alumni_interaction = ?,
          no_of_industrial_visit = ?,
          no_of_study_tour = ?,
          no_of_fests = ?,
          no_of_fdp = ?,
          no_of_edp = ?,
          no_of_mdp = ?,
          no_of_conferences = ?,
          no_of_workshop = ?,
          no_of_national_seminars = ?,
          seminars_related_to_intellectual_property_rights = ?,
          research_methodology = ?,
          entrepreneurship = ?,
          skill_development = ?,
          current_year = YEAR(CURDATE())
        WHERE sid = ?`,
        [
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
          sid
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO school_activites (
          sid,
          no_of_guest_talk,
          no_of_alumni_interaction,
          no_of_industrial_visit,
          no_of_study_tour,
          no_of_fests,
          no_of_fdp,
          no_of_edp,
          no_of_mdp,
          no_of_conferences,
          no_of_workshop,
          no_of_national_seminars,
          seminars_related_to_intellectual_property_rights,
          research_methodology,
          entrepreneurship,
          skill_development,
          current_year,
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, YEAR(CURDATE()))`,
        [
          sid,
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
        ]
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving form9:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
