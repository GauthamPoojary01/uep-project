const express = require('express');
const router = express.Router();
const db = require('../db');
//backend/routes/schoolRouter.js
// Add new school
router.post('/add', async (req, res) => {
  const { sid, school_name, current_year, no_of_faculties } = req.body;

  try {
    await db.query(
      `INSERT INTO school_profile 
        (sid, school_name, no_of_faculties, current_year, 
         no_of_phd, no_of_net_kset, no_of_without_phd_kset_net, no_of_pursuing_phd,
         total_no_of_associate_professor, total_no_of_assistant_professor,
         total_no_of_professor_of_practice, teaching_staff_assistant) 
       VALUES (?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0)`,
      [sid, school_name, no_of_faculties, current_year]
    );

    res.status(201).json({ message: 'School added successfully' });
  } catch (err) {
    console.error('Error adding school:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
