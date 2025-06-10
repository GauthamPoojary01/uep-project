// Fix: backend/routes/schoolRouter.js
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const db = require('../db'); // ✅ Ensure this is included

router.post('/add', schoolController.addSchool);

// ✅ FIXED: get-all route
router.get('/get-all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT school_name FROM school_metadata');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching schools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
