// UEPFINAL/backend/controllers/schoolController.js
const db = require('../db');

exports.addSchool = async (req, res) => {
  const { school_name } = req.body;
  if (!school_name) {
    return res.status(400).json({ error: 'School name is required' });
  }

  try {
    const [rows] = await db.query('SELECT MAX(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(school_id, "_", -2), "_", 1) AS UNSIGNED)) AS maxschool_id FROM school_metadata');
    const nextschool_number = (rows[0].maxschool_id || 0) + 1;
    const school_id = `ALOY_${String(nextschool_number).padStart(2, '0')}_`;

    await db.query(
      'INSERT INTO school_metadata (school_id, school_name) VALUES (?, ?)',
      [school_id, school_name]
    );

    res.status(201).json({ message: 'School added', school_id });
  } catch (err) {
    console.error('Error adding school:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
