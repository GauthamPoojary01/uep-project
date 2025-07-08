// backend/routes/form2Router.js
const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/save', async (req, res) => {
  const { school_id, programmes_4_year, programmes_3_year, pg_programmes, certificate_courses, diploma_courses } = req.body;
  if (!school_id) {
    return res.status(400).json({ message: 'school_id is required' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM school_programmes_and_courses WHERE school_id = ?', [school_id]);

    if (existing.length > 0) {
      await db.query(`
        UPDATE school_programmes_and_courses
        SET total_no_of_programs_4years = ?,
            total_no_of_programs_3years = ?,
            total_no_of_programs_pg = ?,
            total_no_of_certificate_courses = ?,
            total_no_of_diploma_courses = ?
        WHERE school_id = ?
      `, [
        programmes_4_year,
        programmes_3_year,
        pg_programmes,
        certificate_courses,
        diploma_courses,
        school_id
      ]);
    } else {
      await db.query(`
        INSERT INTO school_programmes_and_courses (
          school_id,
          total_no_of_programs_4years,
          total_no_of_programs_3years,
          total_no_of_programs_pg,
          total_no_of_certificate_courses,
          total_no_of_diploma_courses,
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        school_id,
        programmes_4_year,
        programmes_3_year,
        pg_programmes,
        certificate_courses,
        diploma_courses
      ]);
    }

    res.status(200).json({ message: 'Form 2 data saved successfully' });
  } catch (err) {
    console.error('Error saving form 2 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/submit', async (req, res) => {
  const { school_id } = req.body;
  if (!school_id) return res.status(400).json({ message: 'school_id is required' });

  try {
    await db.query('UPDATE school_programmes_and_courses SET status = ? WHERE school_id = ?', ['submitted', school_id]);
    res.status(200).json({ message: 'Form 2 submitted successfully' });
  } catch (err) {
    console.error('Error submitting form 2:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/', async (req, res) => {
  const school_id = req.query.school_id;
  if (!school_id) return res.status(400).json({ message: 'school_id is required' });

  try {
    const [rows] = await db.query('SELECT * FROM school_programmes_and_courses WHERE school_id = ?', [school_id]);
    if (rows.length === 0) return res.status(404).json({ message: 'No data found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching form 2 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;