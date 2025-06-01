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


module.exports = router;
