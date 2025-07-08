// backend/routes/form12Router.js
const express = require("express");
const router = express.Router();
const db = require("../db"); 


router.get("/:school_id", async (req, res) => {
  const school_id = req.params.school_id;
  try {
    const [rows] = await db.query("SELECT * FROM student_achievement WHERE school_id = ?", [school_id]);
    if (rows.length > 0) {
      const row = rows[0];
      res.json({
        cleared_competitive_exam: row.cleard_competitive_exam,
        papers_presented: row.paper_presentation,
        papers_published: row.total_no_of_paper_publication,
        events_attended_outschool_ide: row.events_outschool_ide_college,
        status: row.status,
      });
    } else {
      res.json({});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.post("/", async (req, res) => {
  const user = JSON.parse(req.headers.user || '{}');
  const school_id = user.school_id;
  const currentYear = new Date().getFullYear();

  const {
    cleared_competitive_exam,
    papers_presented,
    papers_published,
    events_attended_outschool_ide,
    status = "draft",
  } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM student_achievement WHERE school_id = ?", [school_id]);

    if (existing.length > 0) {
     
      await db.query(
        `UPDATE student_achievement SET 
          cleard_competitive_exam = ?,
          paper_presentation = ?,
          total_no_of_paper_publication = ?,
          events_outschool_ide_college = ?,
          status = ?,
          current_year = ?
        WHERE school_id = ?`,
        [
          cleared_competitive_exam,
          papers_presented,
          papers_published,
          events_attended_outschool_ide,
          status,
          currentYear,
          school_id,
        ]
      );
    } else {
      
      await db.query(
        `INSERT INTO student_achievement (
          school_id, cleard_competitive_exam, paper_presentation, total_no_of_paper_publication, 
          events_outschool_ide_college, current_year, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          school_id,
          cleared_competitive_exam,
          papers_presented,
          papers_published,
          events_attended_outschool_ide,
          currentYear,
          status,
        ]
      );
    }

    res.status(200).send("Data saved successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
   
