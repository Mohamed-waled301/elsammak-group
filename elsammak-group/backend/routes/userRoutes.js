const express = require('express');
const { getMe, getUserQR } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all user routes

router.get('/me', getMe);
router.get('/:id/qr', getUserQR);

module.exports = router;
