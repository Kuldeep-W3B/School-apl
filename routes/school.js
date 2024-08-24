const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/school');

router.post('/addSchool', schoolController.addSchool);
router.get('/listSchools', schoolController.listSchools);


module.exports = router;
