const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const schoolController = require('../controllers/schoolController');
const assessorController = require('../controllers/assessorController');
import { verifyAssessor } from './loginRoute';


router.get('/schools', verifyAssessor, assessorController.getAllSchools);
router.get('/students', verifyAssessor, assessorController.getAllStudents);
export default router;
