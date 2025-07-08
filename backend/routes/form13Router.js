//backend/routes/form13Router.js
const express = require("express");
const router = express.Router();
const pool = require("../db");


const getCurrentYear = () => new Date().getFullYear();


router.get("/:school_id", async (req, res) => {
  const { school_id } = req.params;
  try {
    const [result] = await pool.query("SELECT * FROM student_intake WHERE school_id = ?", [school_id]);
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: "No data found for given school_id." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});


router.post("/", async (req, res) => {
  const {
    total_intake,
    total_admitted,
    dropout_this_year,
    male_admitted,
    female_admitted,
    outschool_ide_state_admissions,
    inschool_ide_state_admissions,
    foreign_students_admitted,
    details_link,
    status = "draft"
  } = req.body;

  const user = JSON.parse(req.headers["user"] || "{}");
  const school_id = user.school_id;

  if (!school_id) return res.status(400).json({ error: "school_id missing." });

  try {
    const [existing] = await pool.query("SELECT * FROM student_intake WHERE school_id = ?", [school_id]);
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
          outschool_ide_state = ?,
          within_state = ?,
          foreign_state = ?,
          link_of_the_details = ?,
          current_year = ?,
          status = ?
        WHERE school_id = ?`,
        [
          total_intake,
          total_admitted,
          dropout_this_year,
          male_admitted,
          female_admitted,
          outschool_ide_state_admissions,
          inschool_ide_state_admissions,
          foreign_students_admitted,
          details_link,
          currentYear,
          status,
          school_id
        ]
      );
    } else {
      // Insert
      await pool.query(
        `INSERT INTO student_intake (
          school_id, intake_for_the_year, student_strength, drop_out_for_the_year, male,
          female, outschool_ide_state, within_state, foreign_state, link_of_the_details,
          current_year, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          school_id,
          total_intake,
          total_admitted,
          dropout_this_year,
          male_admitted,
          female_admitted,
          outschool_ide_state_admissions,
          inschool_ide_state_admissions,
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