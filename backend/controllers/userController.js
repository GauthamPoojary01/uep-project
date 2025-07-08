//UEPFINAL/backend/controllers/userController.js
const db = require('../db');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !role) {
    return res.status(400).json({ message: 'Please enter username and select role' });
  }

  try {
    const [results] = await db.query('SELECT * FROM users WHERE username = ? AND role = ?', [username, role]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or role' });
    }

    const user = results[0];

    if (!user.password || user.password === '') {
      return res.status(200).json({ requiresPasswordSetup: true });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.setPassword = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);
    res.json({ message: 'Password set successfully' });
  } catch (err) {
    console.error('Set password error:', err);
    res.status(500).json({ message: 'Database error' });
  }
};


exports.resetPasswordWithOtp = async (req, res) => {
  const { username, otp, newPassword } = req.body;

  const record = otpStore[username];
  if (!record || record.code != otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);

    delete otpStore[username];
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Database error' });
  }
};