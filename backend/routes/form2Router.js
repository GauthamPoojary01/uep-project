const express = require("express");
const router = express.Router();
const pool = require("../db");

// Save route
router.post("/save", async (req, res) => {
  const {
    sid,
    programmes_4_year,
    programmes_3_year,
    pg_programmes,
    certificate_courses,
    diploma_courses,
  } = req.body;

  try {
    let form_id;

    // Check if record exists
    const [existing] = await pool.query(
      "SELECT form_id FROM school_programmes_and_courses WHERE school_id = ?",
      [sid]
    );

    if (existing.length > 0) {
      form_id = existing[0].form_id;
      // Update existing
      await pool.query(
        `UPDATE school_programmes_and_courses SET 
          total_no_of_programs_4years = ?,
          total_no_of_programs_3years = ?,
          total_no_of_programs_pg = ?,
          current_year = YEAR(CURDATE())
         WHERE school_id = ?`,
        [
          programmes_4_year,
          programmes_3_year,
          pg_programmes,
          sid
        ]
      );
    } else {
      // Insert new and get form_id
      const [result] = await pool.query(
        `INSERT INTO school_programmes_and_courses (
          school_id, total_no_of_programs_4years, total_no_of_programs_3years, total_no_of_programs_pg, current_year
        ) VALUES (?, ?, ?, ?, YEAR(CURDATE()))`,
        [sid, programmes_4_year, programmes_3_year, pg_programmes]
      );
      form_id = result.insertId;
    }

    // Update or insert status
    const [statusRows] = await pool.query(
      "SELECT * FROM form_status2 WHERE school_id = ?",
      [sid]
    );

    if (statusRows.length > 0) {
      await pool.query(
        "UPDATE form_status2 SET status = 'draft' WHERE school_id = ?",
        [sid]
      );
    } else {
      await pool.query(
        "INSERT INTO form_status2 (form_id, school_id, status) VALUES (?, ?, 'draft')",
        [form_id, sid]
      );
    }

    res.status(200).json({ message: "Form saved" });
  } catch (err) {
    console.error("Error saving form 2 data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Submit route
router.post("/submit", async (req, res) => {
  const { sid } = req.body;

  try {
    await pool.query(
      `UPDATE form_status2 SET status = 'submitted', submission_date = NOW() WHERE school_id = ?`,
      [sid]
    );
    res.status(200).json({ message: "Form submitted" });
  } catch (err) {
    console.error("Error submitting form 2:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get saved data
router.get("/", async (req, res) => {
  const sid = req.query.sid;

  try {
    const [data] = await pool.query(
      `SELECT 
        total_no_of_programs_4years AS programmes_4_year,
        total_no_of_programs_3years AS programmes_3_year,
        total_no_of_programs_pg AS pg_programmes,
        '' AS certificate_courses,
        '' AS diploma_courses,
        fs.status
      FROM school_programmes_and_courses sp
      LEFT JOIN form_status2 fs ON sp.form_id = fs.form_id
      WHERE sp.school_id = ?`,
      [sid]
    );

    if (data.length > 0) {
      res.status(200).json(data[0]);
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (err) {
    console.error("Error fetching form 2 data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
