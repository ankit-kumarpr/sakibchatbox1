const express = require('express');
const router = express.Router();
const {register,login,resetSpecialId,getallusers,GetallAdmins,profile} = require('../controllers/authController');
const {superAdminInit}=require('../controllers/superAdminInit');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');


router.post('/superadmin',superAdminInit);
router.post('/register', authenticateToken, authorizeRole('superadmin', 'admin'), register);
router.post('/reset-special-id', authenticateToken, authorizeRole('superadmin', 'admin'),resetSpecialId);
router.post('/login',login);
router.get('/getadmins', authenticateToken, authorizeRole('superadmin'),GetallAdmins);
router.get('/getusers', authenticateToken, authorizeRole('superadmin', 'admin'),getallusers);
router.post('/register', authenticateToken, authorizeRole('superadmin', 'admin'), register);
router.post('/register', authenticateToken, authorizeRole('superadmin', 'admin'), register);
router.get('/profile',authenticateToken, profile);


module.exports=router;
