//backend/controllers/userController.js
const db = require('../db');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { username, password, role } = req.body;

 if (!username || !role) {
  toast.error('Please enter username and select role');
  return;
}

setLoading(true);

try {
  const response = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role }),
  });

  const data = await response.json();

  if (data.requiresPasswordSetup) {
    toast('🔐 Please set your password');
    router.push(`/set-password?user=${encodeURIComponent(username)}`);
    return;
  }

  if (response.ok) {
    toast.success('Login successful!');
    localStorage.setItem('user', JSON.stringify(data.user));

    if (role === 'Admin') {
      router.push(`/admin/`);
    } else if (role === 'Dean') {
      router.push(`/dashboard/${username}`);
    } else {
      toast.error('Unknown role');
    }
  } else {
    toast.error(data.message || 'Login failed');
  }
} catch (error) {
  toast.error('Error connecting to server');
  console.error(error);
} finally {
  setLoading(false);
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