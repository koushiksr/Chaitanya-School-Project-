import { verifyAssessor, verifySchool, verifyStudent } from "./loginRoute";
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const activityController = require('../controllers/activityController');


router.get('/admin/:id', verifyStudent, studentController.getStudentAdmin);

// for assessor
router.get('/activity/assessor/:schoolID?/:candidateID?', verifyAssessor, activityController.getAllforAssessor);
router.post('/activity/assessor/create', verifyAssessor, activityController.createbyAssesser);
 
//for other
router.get('/activity/progress/:SchoolID/:candidateID/:activity', verifyStudent, activityController.getLast4ActivityBycandidateID);
router.get('/activity/:schoolID/:candidateID', verifyStudent, activityController.getAll);
router.get('/activity/:schoolID/:activity?/:rating?', verifySchool, activityController.getAllActivityBySchoolID);
router.post('/activity/create', verifyStudent, activityController.create);
router.put('/activity/edit/:id', verifyStudent, activityController.edit);
router.delete('/activity/delete/:id', verifyStudent, activityController.delete);

export default router