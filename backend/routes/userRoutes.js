const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
// Make sure filename is otpController.js
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/send-otp', otpController.sendOtp);
router.post('/reset-password-otp', otpController.resetPasswordWithOtp);

// server/routes/userRoutes.js
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



// Add a new user (Admin or Dean)
router.post('/add', async (req, res) => {
  const { username, password, role, name, department } = req.body;

  if (!username || !password || !role || !name || !department) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, password, role, name, department) VALUES (?, ?, ?, ?, ?)`;
    await db.query(query, [username, hashedPassword, role, name, department]);

    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a user by ID
router.delete('/remove/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await db.query(`DELETE FROM users WHERE id = ?`, [userId]);
    res.status(200).json({ message: 'User removed successfully' });
  } catch (err) {
    console.error('Error removing user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
