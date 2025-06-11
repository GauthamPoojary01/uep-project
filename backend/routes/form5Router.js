// backend/routes/form5Router.js

const express = require("express");
const router = express.Router();
const db = require("../db");

// GET form5 data by sid
router.get("/:sid", async (req, res) => {
  const { sid } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM phd WHERE sid = ?", [sid]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "No data found for this SID" });
    }
  } catch (error) {
    console.error("Error fetching Form5 data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST (insert/update) form5 data
router.post("/", async (req, res) => {
  const {
    sid,
    research_guides,
    intake,
    phd_part_time,
    phd_full_time,
    currennt_year,
    phd_completed,
    admitted,
    status,
  } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM phd WHERE sid = ?", [sid]);

    if (existing.length > 0) {
      // Update
      await db.query(
        `UPDATE phd SET research_guides = ?, total_no_of_intake = ?, total_no_of_part_time = ?, total_no_of_full_time = ?,
         currennt_year = ?, total_no_of_completed = ?, total_no_of_admitted = ?, status = ? WHERE sid = ?`,
        [
          research_guides,
          intake,
          phd_part_time,
          phd_full_time,
          currennt_year,
          phd_completed,
          admitted,
          status,
          sid,
        ]
      );
    } else {
      // Insert
      await db.query(
        `INSERT INTO phd (sid, research_guides, total_no_of_intake, total_no_of_part_time, total_no_of_full_time,
          currennt_year, total_no_of_completed, total_no_of_admitted, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sid,
          research_guides,
          intake,
          phd_part_time,
          phd_full_time,
          currennt_year,
          phd_completed,
          admitted,
          status,
        ]
      );
    }

    res.status(200).json({ message: "Form5 data saved successfully" });
  } catch (error) {
    console.error("Error saving Form5 data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;