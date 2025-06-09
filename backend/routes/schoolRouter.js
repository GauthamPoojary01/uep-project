// ✅ FIXED: backend/routes/schoolRouter.js
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController'); // ✅ Import the controller

router.post('/add', schoolController.addSchool); // Use the controller

module.exports = router;
