//backend/routes/form14router.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const {
    intake,
    admitted,
    graduating,
    placements,
    higher_studies,
    details_link,
    status,
  } = req.body;

  const user = JSON.parse(req.headers["user"] || "{}");
  const school_id = user.school_id;
  const current_year = new Date().getFullYear();

  if (!school_id) {
    return res.status(400).json({ error: "school_id missing in user header" });
  }

  const query = `
    INSERT INTO placement_and_highereducation
      (school_id, graduating, placed, higher_education, link_of_the_details, current_year)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      graduating = VALUES(graduating),
      placed = VALUES(placed),
      higher_education = VALUES(higher_education),
      link_of_the_details = VALUES(link_of_the_details),
      current_year = VALUES(current_year);
  `;

  db.query(
    query,
    [
      school_id,
      graduating,
      placements,
      higher_studies,
      details_link,
      current_year,
    ],
    (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      return res.status(200).json({ message: "Form14 data saved successfully" });
    }
  );
});

router.get("/:school_id", (req, res) => {
  const { school_id } = req.params;
  const query = `SELECT graduating, placed, higher_education, link_of_the_details FROM placement_and_highereducation WHERE school_id = ?`;

  db.query(query, [school_id], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }

    const data = results[0];
    const mapped = {
      graduating: data.graduating?.toString() || '',
      placements: data.placed?.toString() || '',
      higher_studies: data.higher_education?.toString() || '',
      details_link: data.link_of_the_details || '',
    };
    return res.json(mapped);
  });
});

module.exports = router;