const User = require('../models/User');
const QRCode = require('qrcode');

const Case = require('../models/Case');

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cases = await Case.find({ userId: user._id });
    
    const qrValue = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/${user._id}`;
    const qrCode = await QRCode.toDataURL(qrValue);

    res.status(200).json({ 
      success: true, 
      data: {
        user,
        cases,
        qrCode
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get User QR Code
// @route   GET /api/users/:id/qr
// @access  Private (User/Admin)
exports.getUserQR = async (req, res) => {
  try {
    // Check if the user is requesting their own QR, or if they are admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const qrValue = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/${req.params.id}`;
    
    // Generate QR Code as Data URI (base64 image)
    const qrImage = await QRCode.toDataURL(qrValue);

    res.status(200).json({ success: true, qrCode: qrImage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
