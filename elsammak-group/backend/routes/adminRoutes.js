const express = require('express');
const {
  getAllUsers,
  getUserById,
  getUserCases,
  downloadUserData
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Restrict all these routes to admin

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/users/:id/cases', getUserCases);
router.get('/users/:id/download', downloadUserData);

module.exports = router;
