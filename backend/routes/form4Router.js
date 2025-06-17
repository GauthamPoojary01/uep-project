// backend/routes/form4Router.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Save or update research data
router.post('/save', async (req, res) => {
  const { sid, data } = req.body;

  if (!sid || !data) {
    return res.status(400).json({ error: 'sid and data are required' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM research WHERE sid = ?', [sid]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE research SET 
          scopus = ?,
          wos = ?,
          total_no_of_ugc_care = ?,
          total_no_of_h_index = ?,
          total_no_of_citation = ?,
          total_no_of_awards = ?,
          total_no_of_books_chapter_published = ?,
          total_no_of_paper_published = ?,
          total_no_of_link_research = ?,
          currennt_year = ?
        WHERE sid = ?`,
        [
          data.scopus,
          data.wos,
          data.ugc_care,
          data.h_index,
          data.citation,
          data.awards,
          data.books,
          data.paper_presented,
          data.chapters_published,
          data.currennt_year,
          sid
        ]
      );
    } else {
      await db.query(
        `INSERT INTO research (
          sid,
          scopus,
          wos,
          total_no_of_ugc_care,
          total_no_of_h_index,
          total_no_of_citation,
          total_no_of_awards,
          total_no_of_books_chapter_published,
          total_no_of_paper_published,
          total_no_of_link_research,
          currennt_year
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sid,
          data.scopus,
          data.wos,
          data.ugc_care,
          data.h_index,
          data.citation,
          data.awards,
          data.books,
          data.paper_presented,
          data.chapters_published,
          data.currennt_year
        ]
      );
    }

    res.json({ message: 'Data saved successfully' });
  } catch (err) {
    console.error('Error saving form4 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit form - updates status only
router.post('/submit', async (req, res) => {
  const { sid } = req.body;

  if (!sid) {
    return res.status(400).json({ error: 'sid is required' });
  }

  try {
    await db.query(
      `UPDATE research SET status = 'submitted' WHERE sid = ?`,
      [sid]
    );
    res.json({ message: 'Form submitted successfully' });
  } catch (err) {
    console.error('Error submitting form4:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get form data by SID
router.get('/:sid', async (req, res) => {
  const { sid } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM research WHERE sid = ?', [sid]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching form4 data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
