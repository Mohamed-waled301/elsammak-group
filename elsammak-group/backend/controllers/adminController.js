const User = require('../models/User');
const Case = require('../models/Case');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }); // Only fetch clients
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get user cases
// @route   GET /api/admin/users/:id/cases
// @access  Private/Admin
exports.getUserCases = async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.params.id });
    res.status(200).json({ success: true, count: cases.length, data: cases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Download user data as PDF
// @route   GET /api/admin/users/:id/download
// @access  Private/Admin
exports.downloadUserData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cases = await Case.find({ userId: user._id });
    const qrValue = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/${user._id}`;
    const qrBuffer = await QRCode.toBuffer(qrValue); // Get buffer for PDF

    // Create PDF
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=user_${user._id}.pdf`);
    
    doc.pipe(res);

    doc.fontSize(25).text('User Profile', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`National ID: ${user.nationalId}`);
    doc.text(`Phone: ${user.phone}`);
    doc.text(`Governorate: ${user.governorate}`);
    doc.text(`City: ${user.city}`);
    doc.text(`Status: ${user.isVerified ? 'Verified' : 'Pending Verification'}`);
    
    doc.moveDown();
    doc.fontSize(20).text('Cases', { underline: true });
    doc.moveDown();

    if (cases.length === 0) {
      doc.fontSize(12).text('No cases found for this user.');
    } else {
      cases.forEach((c, index) => {
        doc.fontSize(12).text(`${index + 1}. ${c.caseName} - Type: ${c.type} - Status: ${c.status}`);
      });
    }

    doc.moveDown();
    doc.fontSize(20).text('User QR Code', { underline: true });
    doc.moveDown();
    doc.image(qrBuffer, { fit: [150, 150], align: 'center' });

    doc.end();

  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
