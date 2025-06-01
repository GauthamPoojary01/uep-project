// backend/controllers/otpController.js
const nodemailer = require('nodemailer');
const db = require('../db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const otpStore = {};

exports.sendOtp = async (req, res) => {
  const { username } = req.body;

  // Create OTP and store with expiry
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[username] = {
    code: otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 mins
  };

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: username,
    subject: 'Your OTP for password reset',
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
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

    const query = 'UPDATE users SET password = ? WHERE username = ?';
    db.query(query, [hashedPassword, username], (err) => {
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ message: 'Database error' });
      }

      // Delete OTP after successful reset
      delete otpStore[username];
      res.json({ message: 'Password reset successful' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error hashing password' });
  }
};
