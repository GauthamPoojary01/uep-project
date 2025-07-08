// backend/routes/form11Router.js

const express = require("express");
const router = express.Router();
const pool = require("../db");


router.get("/:school_id", async (req, res) => {
  const { school_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
        school_id, 
        total_no_of_certificate_courses AS total_certificate_courses, 
        student_enrolled AS total_students_enrolled, 
        faculties_offering AS total_faculties_offering, 
        total_faculty, 
        status 
      FROM certificate_courses WHERE school_id = ?`,
      [school_id]
    );

    if (rows.length > 0) {
      return res.json(rows[0]);
    }
    return res.json(null);
  } catch (error) {
    console.error("Error fetching form11:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/", async (req, res) => {
  const {
    school_id,
    total_certificate_courses,
    total_students_enrolled,
    total_faculties_offering,
    total_faculty,
    status = "draft"
  } = req.body;

  try {
    const [existing] = await pool.query("SELECT * FROM certificate_courses WHERE school_id = ?", [school_id]);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE certificate_courses SET 
          total_no_of_certificate_courses = ?, 
          student_enrolled = ?, 
          faculties_offering = ?, 
          total_faculty = ?, 
          status = ?,
          rejection_reason = NULL,
          current_year = YEAR(CURDATE())
        WHERE school_id = ?`,
        [
          total_certificate_courses,
          total_students_enrolled,
          total_faculties_offering,
          total_faculty,
          status,
          school_id
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO certificate_courses (
          school_id,
          total_no_of_certificate_courses,
          student_enrolled,
          faculties_offering,
          total_faculty,
          status,
          current_year
        ) VALUES (?, ?, ?, ?, ?, ?, YEAR(CURDATE()))`,
        [
          school_id,
          total_certificate_courses,
          total_students_enrolled,
          total_faculties_offering,
          total_faculty,
          status
        ]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving form11:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;