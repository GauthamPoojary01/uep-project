// backend/routes/form4Router.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET research data by SID
router.get('/:sid', async (req, res) => {
  const { sid } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM research WHERE sid = ?', [sid]);
    if (rows.length === 0) return res.status(404).json({ message: 'No data found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching research data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST or UPDATE research data
router.post('/', async (req, res) => {
  const {
    sid,
    scopus,
    wos,
    ugc_care,
    h_index,
    citation,
    awards,
    books,
    chapters_published,
    paper_presented,
    currennt_year,
    status
  } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM research WHERE sid = ?', [sid]);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE research SET scopus=?, wos=?, total_no_of_ugc_care=?, total_no_of_h_index=?, total_no_of_citation=?, total_no_of_awards=?, total_no_of_books_chapter_published=?, total_no_of_paper_published=?, total_no_of_link_research=?, currennt_year=?, status=? WHERE sid=?`,
        [scopus, wos, ugc_care, h_index, citation, awards, books, paper_presented, chapters_published, currennt_year, status, sid]
      );
      res.json({ message: 'Data updated successfully' });
    } else {
      await pool.query(
        `INSERT INTO research (sid, scopus, wos, total_no_of_ugc_care, total_no_of_h_index, total_no_of_citation, total_no_of_awards, total_no_of_books_chapter_published, total_no_of_paper_published, total_no_of_link_research, currennt_year, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [sid, scopus, wos, ugc_care, h_index, citation, awards, books, paper_presented, chapters_published, currennt_year, status]
      );
      res.json({ message: 'Data saved successfully' });
    }
  } catch (err) {
    console.error('Error saving research data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;