// backend/routes/form12Router.js
const express = require("express");
const router = express.Router();
const db = require("../db"); 


router.get("/:sid", async (req, res) => {
  const sid = req.params.sid;
  try {
    const [rows] = await db.query("SELECT * FROM student_achievement WHERE sid = ?", [sid]);
    if (rows.length > 0) {
      const row = rows[0];
      res.json({
        cleared_competitive_exam: row.cleard_competitive_exam,
        papers_presented: row.paper_presentation,
        papers_published: row.total_no_of_paper_publication,
        events_attended_outside: row.events_outside_college,
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
  const sid = user.sid;
  const currentYear = new Date().getFullYear();

  const {
    cleared_competitive_exam,
    papers_presented,
    papers_published,
    events_attended_outside,
    status = "draft",
  } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM student_achievement WHERE sid = ?", [sid]);

    if (existing.length > 0) {
     
      await db.query(
        `UPDATE student_achievement SET 
          cleard_competitive_exam = ?,
          paper_presentation = ?,
          total_no_of_paper_publication = ?,
          events_outside_college = ?,
          status = ?,
          current_year = ?
        WHERE sid = ?`,
        [
          cleared_competitive_exam,
          papers_presented,
          papers_published,
          events_attended_outside,
          status,
          currentYear,
          sid,
        ]
      );
    } else {
      
      await db.query(
        `INSERT INTO student_achievement (
          sid, cleard_competitive_exam, paper_presentation, total_no_of_paper_publication, 
          events_outside_college, current_year, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          sid,
          cleared_competitive_exam,
          papers_presented,
          papers_published,
          events_attended_outside,
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
   
