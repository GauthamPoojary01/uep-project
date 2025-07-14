const express = require("express");
const router = express.Router();
const pool = require("../db");

// Save router
router.post("/save", async (req, res) => {
  const { sid, data } = req.body;
  const {
    total_no_of_associate_professor,
    total_no_of_assistant_professor,
    total_no_of_professor_of_practice,
    total_no_of_professor
  } = data;

  try {
    let form_id;

    // Check if record exists
    const [existing] = await pool.query(
      "SELECT form_id FROM staff_profile WHERE school_id = ?",
      [sid]
    );

    if (existing.length > 0) {
      form_id = existing[0].form_id;
      // Update existing
      await pool.query(
        `UPDATE staff_profile SET 
          total_no_of_associate_professor = ?,
          total_no_of_assistant_professor = ?,
          total_no_of_professor_of_practice = ?,
          total_no_of_professor = ?,
          current_year = YEAR(CURDATE())
         WHERE school_id = ?`,
        [
          total_no_of_associate_professor,
          total_no_of_assistant_professor,
          total_no_of_professor_of_practice,
          total_no_of_professor,
          sid
        ]
      );
    } else {
      // Insert new and get form_id
      const [result] = await pool.query(
        `INSERT INTO staff_profile (
          school_id, total_no_of_associate_professor, total_no_of_assistant_professor, 
          total_no_of_professor_of_practice, total_no_of_professor, current_year
        ) VALUES (?, ?, ?, ?, ?, YEAR(CURDATE()))`,
        [
          sid,
          total_no_of_associate_professor,
          total_no_of_assistant_professor,
          total_no_of_professor_of_practice,
          total_no_of_professor
        ]
      );
      form_id = result.insertId;
    }

    // Update or insert status
    const [statusRows] = await pool.query(
      "SELECT * FROM form_status1 WHERE school_id = ?",
      [sid]
    );

    if (statusRows.length > 0) {
      await pool.query(
        "UPDATE form_status1 SET status = 'draft' WHERE school_id = ?",
        [sid]
      );
    } else {
      await pool.query(
        "INSERT INTO form_status1 (form_id, school_id, status) VALUES (?, ?, 'draft')",
        [form_id, sid]
      );
    }

    res.status(200).json({ message: "Form saved" });
  } catch (err) {
    console.error("Error saving form 3 data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Submit route
router.post("/submit", async (req, res) => {
  const { sid } = req.body;

  try {
    await pool.query(
      `UPDATE form_status1 SET status = 'submitted', submission_date = NOW() WHERE school_id = ?`,
      [sid]
    );
    res.status(200).json({ message: "Form submitted" });
  } catch (err) {
    console.error("Error submitting form 3:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get saved data
router.get("/", async (req, res) => {
  const sid = req.query.sid;


  
  try {
    const [data] = await pool.query(
      `SELECT 
        total_no_of_associate_professor AS associate_professors,
        total_no_of_assistant_professor AS assistant_professors,
        total_no_of_professor_of_practice AS professors_in_practice,
        fs.status
      FROM staff_profile sp
      LEFT JOIN form_status1 fs ON sp.form_id = fs.form_id
      WHERE sp.school_id = ?`,
      [sid]
    );

    if (data.length > 0) {
      res.status(200).json(data[0]);
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (err) {
    console.error("Error fetching form 3 data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
