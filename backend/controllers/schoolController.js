///backend/controllers/schoolController.js
const db = require('../db');

exports.addSchool = async (req, res) => {
  const { school_name } = req.body;
  if (!school_name) {
    return res.status(400).json({ error: 'School name is required' });
  }

  try {
    const [rows] = await db.query('SELECT MAX(sid) as maxSid FROM school_metadata');
    const nextSid = (rows[0].maxSid || 0) + 1;
    const school_id = `ALOY_${String(nextSid).padStart(2, '0')}_`;

    await db.query(
      'INSERT INTO school_metadata (sid, school_id, school_name) VALUES (?, ?, ?)',
      [nextSid, school_id, school_name]
    );

    res.status(201).json({ message: 'School added', sid: nextSid });
  } catch (err) {
    console.error('Error adding school:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



