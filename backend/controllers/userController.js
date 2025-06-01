//backend/controllers/userController
const db = require('../db'); // adjust this based on where your DB config is
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

const query = 'SELECT * FROM users WHERE username = ? AND role = ?';

  db.query(query, [username, role], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or role' });
    }

  const user = results[0];
  const match = await bcrypt.compare(password, user.password);
 

    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ message: 'Login successful', user });
  });

};
