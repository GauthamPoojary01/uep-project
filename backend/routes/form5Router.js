// backend/routes/form5Router.js

const express = require("express");
const router = express.Router();
const db = require("../db");


router.get("/:school_id", async (req, res) => {
  const { school_id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM phd WHERE school_id = ?", [school_id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "No data found for this school_id" });
    }
  } catch (error) {
    console.error("Error fetching Form5 data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST (insert/update) form5 data
router.post("/", async (req, res) => {
  const {
    school_id,
    research_guides,
    intake,
    phd_part_time,
    phd_full_time,
    currennt_year,
    phd_completed,
    admitted,
    status = "draft",
  } = req.body;

  if (!school_id) {
    return res.status(400).json({ error: "school_id is required" });
  }

  if (parseInt(intake) !== parseInt(phd_part_time) + parseInt(phd_full_time)) {
    return res.status(400).json({
      error: "Total intake must equal sum of part-time and full-time PhD students",
    });
  }

  try {
    const [existing] = await db.query("SELECT * FROM phd WHERE school_id = ?", [school_id]);

    if (existing.length > 0) {
      // Update
      await db.query(
        `UPDATE phd SET research_guides = ?, total_no_of_intake = ?, total_no_of_part_time = ?, total_no_of_full_time = ?,
         currennt_year = ?, total_no_of_completed = ?, total_no_of_admitted = ?, status = ? WHERE school_id = ?`,
        [
          research_guides,
          intake,
          phd_part_time,
          phd_full_time,
          currennt_year,
          phd_completed,
          admitted,
          status,
          school_id,
        ]
      );
    } else {
      // Insert
      await db.query(
        `INSERT INTO phd (school_id, research_guides, total_no_of_intake, total_no_of_part_time, total_no_of_full_time,
          currennt_year, total_no_of_completed, total_no_of_admitted, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          school_id,
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
