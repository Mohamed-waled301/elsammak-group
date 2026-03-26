const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    console.log("🔥 Register API Hit");
    console.log("BODY:", req.body);

    const { name, email, password, nationalId, phone, governorate, city } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    const user = new User({
      name,
      email,
      password,
      nationalId,
      phone,
      governorate,
      city,
      role: 'user',
      otp,
      otpExpires
    });

    await user.save();

    console.log("🟢 User saved");

    // 🔥 حماية من كراش الإيميل
    try {
      const message = `Your OTP is: ${otp}`;
      await sendEmail(user.email, 'OTP Verification', message);
    } catch (e) {
      console.log("⚠️ Email failed but continue");
    }

    res.status(201).json({
      success: true,
      message: 'User registered'
    });

  } catch (err) {
    console.error("❌ Register Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= VERIFY OTP =================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already verified' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login error' });
  }
};

// ================= RESEND OTP =================
exports.resendOTP = async (req, res) => {
  try {
    console.log("🔥 Resend OTP Hit");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    console.log("🔢 NEW OTP:", otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully"
    });

  } catch (err) {
    console.error("❌ Resend OTP Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};