const db = require('../db');

exports.addSchool = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'School name required' });

  try {
    const [last] = await db.query('SELECT COUNT(*) AS count FROM school_metadata');
    const nextId = last[0].count + 1;
    const school_id = `ALOY_${nextId.toString().padStart(2, '0')}_`;

    const [insertResult] = await db.query('INSERT INTO school_metadata (school_id, name) VALUES (?, ?)', [school_id, name]);
    res.status(201).json({ message: 'School added', school_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding school' });
  }
};
