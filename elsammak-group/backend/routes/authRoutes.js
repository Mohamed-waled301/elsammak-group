const express = require('express');
const { register, login, verifyOTP, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
