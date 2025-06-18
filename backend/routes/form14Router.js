
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
  const sid = user.sid;
  const current_year = new Date().getFullYear();

  if (!sid) {
    return res.status(400).json({ error: "SID missing in user header" });
  }

  const query = `
    INSERT INTO placement_and_highereducation
      (sid, graduating, placed, higher_education, link_of_the_details, current_year)
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
      sid,
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

router.get("/:sid", (req, res) => {
  const { sid } = req.params;
  const query = `SELECT graduating, placed, higher_education, link_of_the_details FROM placement_and_highereducation WHERE sid = ?`;

  db.query(query, [sid], (err, results) => {
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