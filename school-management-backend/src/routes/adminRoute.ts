// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// import { verifyToken } from './loginRoute'; 
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const schoolController = require('../controllers/schoolController');
const assessorController = require('../controllers/assessorController');
import { verifyAdmin } from './loginRoute';

router.get('', verifyAdmin, adminController.getAdmin);
router.post('/school/create', verifyAdmin, schoolController.create);
router.get('/school/', verifyAdmin, schoolController.getAllSchool);
router.put('/school/edit/:id', verifyAdmin, schoolController.editSchool);
router.delete('/school/delete/:id', verifyAdmin, schoolController.deleteSchool);

router.post('/assessor/', verifyAdmin, assessorController.create);
router.get('/assessor/', verifyAdmin, assessorController.getAll);
router.put('/asssessor/:id', verifyAdmin, assessorController.edit);
router.delete('/assessor/:id', verifyAdmin, assessorController.delete);
export default router;
