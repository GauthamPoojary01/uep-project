const express = require('express');
const router = express.Router();
const db = require('../db');

// Save or update form1 data
router.post('/save', async (req, res) => {
  const {
    school_id,
    year,
    total_faculty,
    phd_holders,
    net_kset,
    without_phd_kset,
    pursuing_phd
  } = req.body;

  if (!school_id) {
    return res.status(400).json({ message: 'school_id is required' });
  }

  try {
    // Check if profile already exists
    const [existing] = await db.query('SELECT * FROM school_profile WHERE school_id = ?', [school_id]);

    let form_id;
    if (existing.length > 0) {
      // Update existing record
      form_id = existing[0].form_id;
      await db.query(`
        UPDATE school_profile
        SET year_of_establishment = ?,
            total_no_of_faculties = ?,
            no_of_phd = ?,
            no_of_net_kset = ?,
            no_of_without_phd_kset_net = ?,
            no_of_pursuing_phd = ?
        WHERE school_id = ?
      `, [
        year,
        total_faculty,
        phd_holders,
        net_kset,
        without_phd_kset,
        pursuing_phd,
        school_id
      ]);
    } else {
      // Insert new record
      const [result] = await db.query(`
        INSERT INTO school_profile (
          school_id,
          year_of_establishment,
          total_no_of_faculties,
          no_of_phd,
          no_of_net_kset,
          no_of_without_phd_kset_net,
          no_of_pursuing_phd
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        school_id,
        year,
        total_faculty,
        phd_holders,
        net_kset,
        without_phd_kset,
        pursuing_phd
      ]);
      form_id = result.insertId;
    }

    // Save or update status in form_status1
    await db.query(`
      INSERT INTO form_status1 (form_id, school_id, status)
      VALUES (?, ?, 'draft')
      ON DUPLICATE KEY UPDATE status = 'draft'
    `, [form_id, school_id]);

    res.status(200).json({ message: 'Form 1 data saved successfully' });
  } catch (err) {
    console.error('Error saving form 1 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit form1
router.post('/submit', async (req, res) => {
  const { school_id } = req.body;
  if (!school_id) return res.status(400).json({ message: 'school_id is required' });

  try {
    const [profile] = await db.query('SELECT form_id FROM school_profile WHERE school_id = ?', [school_id]);
    if (!profile.length) return res.status(404).json({ message: 'Form not found' });

    const form_id = profile[0].form_id;
    await db.query('UPDATE form_status1 SET status = ? WHERE form_id = ?', ['submitted', form_id]);
    res.status(200).json({ message: 'Form 1 submitted successfully' });
  } catch (err) {
    console.error('Error submitting form 1:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get form1 data
router.get('/', async (req, res) => {
  const school_id = req.query.school_id;
  if (!school_id) return res.status(400).json({ message: 'school_id is required' });

  try {
    const [rows] = await db.query('SELECT * FROM school_profile WHERE school_id = ?', [school_id]);
    if (rows.length === 0) return res.status(404).json({ message: 'No data found' });

    const formData = rows[0];
    const [statusRow] = await db.query('SELECT status FROM form_status1 WHERE form_id = ?', [formData.form_id]);
    formData.status = statusRow.length ? statusRow[0].status : 'draft';

    res.json(formData);
  } catch (err) {
    console.error('Error fetching form 1 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
