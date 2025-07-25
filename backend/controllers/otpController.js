//  UEPFINAL/backend/controllers/otpController.js
const nodemailer = require('nodemailer');
const db = require('../db');
const bcrypt = require('bcrypt');
require('dotenv').config();


const otpStore = {};

exports.sendOtp = async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ message: 'Username required' });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[username] = {
    code: otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  };

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: username,
    subject: 'Your OTP for password reset',
    text: `Your OTP is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${username}:`, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  const { username, otp, newPassword } = req.body;

  if (!username || !otp || !newPassword)
    return res.status(400).json({ message: 'All fields required' });

  const record = otpStore[username];
  if (!record || record.code != otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);
    delete otpStore[username];
    console.log(`Password updated for ${username}`);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('DB update error:', err);
    res.status(500).json({ message: 'Database error' });
  }
};
