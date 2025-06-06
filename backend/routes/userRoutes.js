//backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const bcrypt = require('bcrypt');
const db = require('../db');
const userController = require('../controllers/userController');



router.post('/login', userController.login);
router.post('/send-otp', otpController.sendOtp);
router.post('/reset-password-otp', otpController.resetPasswordWithOtp);



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
  const { email, name, password, school, role } = req.body;

  if (!email || !name || !password || !role) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, name, password, department, role) VALUES (?, ?, ?, ?, ?)',
      [email, name, hashedPassword, school || '', role]
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

router.get('/schools', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT department AS name FROM users WHERE role = "Dean"');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching schools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
