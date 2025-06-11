// backend/routes/form11Router.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Save or submit form11
router.post("/form11", async (req, res) => {
  const {
    total_certificate_courses,
    total_students_enrolled,
    total_faculties_offering,
    total_faculty,
    status
  } = req.body;

  const user = JSON.parse(req.headers.user || '{}');
  const sid = user.sid;

  if (!sid) return res.status(400).json({ error: "Missing SID" });

  const query = `INSERT INTO certificate_courses (
    sid,
    total_no_of_certificate_courses,
    student_enrolled,
    faculties_offering,
    total_faculty,
    status
  ) VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    total_no_of_certificate_courses = VALUES(total_no_of_certificate_courses),
    student_enrolled = VALUES(student_enrolled),
    faculties_offering = VALUES(faculties_offering),
    total_faculty = VALUES(total_faculty),
    status = VALUES(status);`;

  try {
    await db.execute(query, [
      sid,
      total_certificate_courses,
      total_students_enrolled,
      total_faculties_offering,
      total_faculty,
      status || "draft"
    ]);
    res.status(200).json({ message: "Form11 data saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get form11 data
router.get("/form11/:sid", async (req, res) => {
  const { sid } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT sid, total_no_of_certificate_courses AS total_certificate_courses, student_enrolled AS total_students_enrolled, faculties_offering AS total_faculties_offering, total_faculty, status FROM certificate_courses WHERE sid = ?",
      [sid]
    );

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "No data found for this SID" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
