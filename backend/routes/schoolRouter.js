const express = require("express");
const router = express.Router();
const db = require("../db");

// Auto-generate ALOY_XX_ ID and insert new school
router.post("/add", async (req, res) => {
  const { school_name, dean_email } = req.body;

  try {
    // Find next number
    const [rows] = await db.query("SELECT COUNT(*) as count FROM schools");
    const nextId = rows[0].count + 1;
    const school_id = `ALOY_${nextId.toString().padStart(2, "0")}_`;

    const [result] = await db.query(
      "INSERT INTO schools (school_id, school_name, dean_email) VALUES (?, ?, ?)",
      [school_id, school_name, dean_email]
    );

    res.status(201).json({ school_id });
  } catch (err) {
    console.error("School add error:", err);
    res.status(500).json({ error: "Failed to add school" });
  }
});

module.exports = router;
