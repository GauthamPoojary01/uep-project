// backend/routes/schoolRouter.js
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const db = require('../db'); 

router.post('/add', schoolController.addSchool);


router.get('/get-all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT sid, school_name FROM school_metadata');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching schools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete/:sid', async (req, res) => {
  const { sid } = req.params;
  try {
   
    const [dean] = await db.query('SELECT * FROM users WHERE sid = ?', [sid]);
    if (dean.length > 0) {
      return res.status(400).json({ error: 'Cannot delete. Dean is assigned to this school.' });
    }

    const [result] = await db.query('DELETE FROM school_metadata WHERE sid = ?', [sid]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'School not found' });
    }

    res.json({ message: 'School deleted successfully' });
  } catch (err) {
    console.error('Error deleting school:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;