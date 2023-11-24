// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// import { verifyToken } from './loginRoute'; 
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const schoolController = require('../controllers/schoolController');
import { verifyAdmin } from './loginRoute';

router.get('', verifyAdmin, adminController.getAdmin);
router.post('/school/create', verifyAdmin, schoolController.create);
router.get('/school/', verifyAdmin, schoolController.getAllSchool);
router.put('/school/edit/:id', verifyAdmin, schoolController.editSchool);
router.delete('/school/delete/:id', verifyAdmin, schoolController.deleteSchool);
export default router;
