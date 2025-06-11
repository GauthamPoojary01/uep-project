//backend/routes/form13Router.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Helper function to get current year
const getCurrentYear = () => new Date().getFullYear();

// GET form13 data by sid
router.get("/:sid", async (req, res) => {
  const { sid } = req.params;
  try {
    const [result] = await pool.query("SELECT * FROM student_intake WHERE sid = ?", [sid]);
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: "No data found for given SID." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

// POST form13 data (insert or update)
router.post("/", async (req, res) => {
  const {
    total_intake,
    total_admitted,
    dropout_this_year,
    male_admitted,
    female_admitted,
    outside_state_admissions,
    inside_state_admissions,
    foreign_students_admitted,
    details_link,
    status = "draft"
  } = req.body;

  const user = JSON.parse(req.headers["user"] || "{}");
  const sid = user.sid;

  if (!sid) return res.status(400).json({ error: "SID missing." });

  try {
    const [existing] = await pool.query("SELECT * FROM student_intake WHERE sid = ?", [sid]);
    const currentYear = getCurrentYear();

    if (existing.length > 0) {
      // Update
      await pool.query(
        `UPDATE student_intake SET 
          intake_for_the_year = ?,
          student_strength = ?,
          drop_out_for_the_year = ?,
          male = ?,
          female = ?,
          outside_state = ?,
          within_state = ?,
          foreign_state = ?,
          link_of_the_details = ?,
          current_year = ?,
          status = ?
        WHERE sid = ?`,
        [
          total_intake,
          total_admitted,
          dropout_this_year,
          male_admitted,
          female_admitted,
          outside_state_admissions,
          inside_state_admissions,
          foreign_students_admitted,
          details_link,
          currentYear,
          status,
          sid
        ]
      );
    } else {
      // Insert
      await pool.query(
        `INSERT INTO student_intake (
          sid, intake_for_the_year, student_strength, drop_out_for_the_year, male,
          female, outside_state, within_state, foreign_state, link_of_the_details,
          current_year, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sid,
          total_intake,
          total_admitted,
          dropout_this_year,
          male_admitted,
          female_admitted,
          outside_state_admissions,
          inside_state_admissions,
          foreign_students_admitted,
          details_link,
          currentYear,
          status
        ]
      );
    }
    res.status(200).json({ message: "Form13 saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save data." });
  }
});

module.exports = router;