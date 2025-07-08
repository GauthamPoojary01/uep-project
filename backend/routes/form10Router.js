//backend/routes/form10Router.js

const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/:school_id', async (req, res) => {
  const { school_id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM staff_achievements WHERE school_id = ?', [school_id]);
    if (rows.length > 0) {
      return res.json(rows[0]);
    }
    return res.json(null);
  } catch (error) {
    console.error('Error fetching form10:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/', async (req, res) => {
  const {
    school_id,
    resource_person,
    total_faculty_attended_seminar,
    total_faculty,
    total_faculty_attended_workshop,
    faculty_kset_net,
    faculty_completed_phd,
    faculty_fdp,
    faculty_edp,
    faculty_mmtp,
    faculty_staff_induction,
    faculty_mooc,
    document_link,
    status = 'draft'
  } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM staff_achievements WHERE school_id = ?', [school_id]);
    if (existing.length > 0) {
      await pool.query(
        `UPDATE staff_achievements SET 
          total_no_resource_person = ?, 
          attended_seminars = ?,
          total_no_of_faculties_workshop = ?,
          kset_net = ?,
          mmmtp = ?,
          staff_induction = ?,
          mooc = ?,
          link_of_the_document = ?,
          current_year = YEAR(CURDATE()),
          status = ?,
          rejection_reason = NULL
        WHERE school_id = ?`,
        [
          resource_person,
          total_faculty_attended_seminar,
          total_faculty_attended_workshop,
          faculty_kset_net,
          faculty_mmtp,
          faculty_staff_induction,
          faculty_mooc,
          document_link,
          status,
          school_id
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO staff_achievements (
          school_id, total_no_resource_person, attended_seminars, total_no_of_faculties_workshop, 
          kset_net, mmmtp, staff_induction, mooc, link_of_the_document, current_year, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, YEAR(CURDATE()), ?)`,
        [
          school_id,
          resource_person,
          total_faculty_attended_seminar,
          total_faculty_attended_workshop,
          faculty_kset_net,
          faculty_mmtp,
          faculty_staff_induction,
          faculty_mooc,
          document_link,
          status
        ]
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving form10:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;