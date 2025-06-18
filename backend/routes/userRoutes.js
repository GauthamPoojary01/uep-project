//backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const bcrypt = require('bcrypt');
const db = require('../db');
const userController = require('../controllers/userController');
const schoolController = require('../controllers/schoolController');


router.post('/login', userController.login);
router.post('/send-otp', otpController.sendOtp);
router.post('/reset-password-otp', otpController.resetPasswordWithOtp);

router.post('/set-password', userController.setPassword);




router.post("/info", async (req, res) => {
  const { username } = req.body;
  try {
    const [rows] = await db.query("SELECT name, department FROM users WHERE username = ?", [username]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/add', async (req, res) => {
  const { email, name, school, role } = req.body;

  if (!email || !name || !role) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  try {
    const [schoolData] = await db.query('SELECT * FROM school_metadata WHERE school_name = ?', [school]);
    if (schoolData.length === 0) {
      return res.status(404).json({ error: 'School not found' });
    }

    const sid = schoolData[0].sid;
    const [result] = await db.execute(
      'INSERT INTO users (username, name, password, department, role, sid) VALUES (?, ?, ?, ?, ?, ?)',
      [email, name, '', school || '', role, sid]
    );

    res.status(201).json({ message: 'User added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while adding user.' });
  }
});

router.get('/get', async (req, res) => {
  try {
    console.log("Trying to fetch users...");
    const [rows] = await db.query("SELECT username, name, role, department FROM users");
    console.log("Fetched rows:", rows);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.delete('/remove/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const [result] = await db.query("DELETE FROM users WHERE username = ?", [username]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update', async (req, res) => {
  const updatedUsers = req.body;

  try {
    for (const user of updatedUsers) {
      const { username, name, department, role } = user;

      await db.query(
        "UPDATE users SET name = ?, department = ?, role = ? WHERE username = ?",
        [name, department, role, username]
      );
    }

    const [rows] = await db.query("SELECT username, name, role, department FROM users");
    res.json(rows);
  } catch (err) {
    console.error('Error updating users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/get-all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT sid, school_name FROM school_metadata');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching schools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/unassigned-schools', async (req, res) => {
  try {
    const [assigned] = await db.query('SELECT sid FROM users WHERE role = "Dean"');
    const assignedSids = assigned.map(row => row.sid).filter(Boolean);
    const [schools] = await db.query(
      assignedSids.length
        ? `SELECT * FROM school_metadata WHERE sid NOT IN (?)`
        : `SELECT * FROM school_metadata`,
      assignedSids.length ? [assignedSids] : []
    );
    res.json(schools);
  } catch (err) {
    console.error('Error fetching unassigned schools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/schools', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT s.school_name
      FROM users u
      JOIN school_metadata s ON u.sid = s.sid
      WHERE u.role = 'Dean'
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching assigned schools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
