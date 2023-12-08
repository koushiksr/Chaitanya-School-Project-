const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const schoolController = require('../controllers/schoolController');
const assessorController = require('../controllers/assessorController');
import { verifyAssessor } from './loginRoute';
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

router.get('/schools', verifyAssessor, assessorController.getAllSchools);
router.get('/students', verifyAssessor, assessorController.getAllStudents);
router.post('/students/assesment/:email/:name', verifyAssessor, upload, assessorController.sendPdfToStudent);
export default router;
