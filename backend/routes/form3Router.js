// backend/routes/form3Router.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Save or update staff profile
router.post('/save', async (req, res) => {
  const { school_id, data } = req.body;

  if (!school_id || !data) {
    return res.status(400).json({ error: 'school_id and data are required' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM school_staff_profile WHERE school_id = ?', [school_id]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE school_staff_profile SET 
          total_no_of_associate_professor = ?,
          total_no_of_assistant_professor = ?,
          total_no_of_professor_of_practice = ?,
          total_no_of_professor = ?,
          status = ?,
          rejection_reason = NULL
        WHERE school_id = ?`,
        [
          data.total_no_of_associate_professor,
          data.total_no_of_assistant_professor,
          data.total_no_of_professor_of_practice,
          data.total_no_of_professor,
          data.status || 'draft',
          school_id
        ]
      );
    } else {
      await db.query(
        `INSERT INTO school_staff_profile (
          school_id,
          total_no_of_associate_professor,
          total_no_of_assistant_professor,
          total_no_of_professor_of_practice,
          total_no_of_professor,
          status,
          rejection_reason
        ) VALUES (?, ?, ?, ?, ?, ?, NULL)`,
        [
          school_id,
          data.total_no_of_associate_professor,
          data.total_no_of_assistant_professor,
          data.total_no_of_professor_of_practice,
          data.total_no_of_professor,
          data.status || 'draft'
        ]
      );
    }

    res.json({ message: 'Data saved successfully' });
  } catch (err) {
    console.error('Error saving form3 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit form - updates status only
router.post('/submit', async (req, res) => {
  const { school_id } = req.body;

  if (!school_id) {
    return res.status(400).json({ error: 'school_id is required' });
  }

  try {
    await db.query(
      `UPDATE school_staff_profile SET status = 'submitted', rejection_reason = NULL WHERE school_id = ?`,
      [school_id]
    );
    res.json({ message: 'Form submitted successfully' });
  } catch (err) {
    console.error('Error submitting form3:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get form data by school_id
router.get('/:school_id', async (req, res) => {
  const { school_id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM school_staff_profile WHERE school_id = ?', [school_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching form3 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
