import { verifySchool, verifySchoolOrStudent } from "./loginRoute";
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const studentController = require('../controllers/studentController');


router.get('/admin/:id', verifySchool, schoolController.getSchoolAdmin);
router.post('/student/create', verifySchool, studentController.create);
router.get('/student/:schoolID', verifySchoolOrStudent, studentController.getAllStudent);
router.get('/student/:schoolID/:candidateClass?/:gender?', verifySchoolOrStudent, studentController.getAllStudentByClassGender);
router.put('/student/edit/:id', verifySchool, studentController.editStudent);
router.delete('/student/delete/:id', verifySchool, studentController.deleteStudent);


export default router;
