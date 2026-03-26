const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    console.log("🔥 Register API Hit");

    const { name, email, password, nationalId, phone, governorate, city } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    const user = await User.create({
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

    // 🔥 الإيميل مش هيكراش
    try {
      await sendEmail(user.email, "OTP Verification", `Your OTP is: ${otp}`);
    } catch (e) {
      console.log("⚠️ Email failed but continue");
    }

    res.status(201).json({
      success: true,
      message: "User registered"
    });

  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ success: false, message: err.message });
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
    res.status(500).json({ success: false, message: 'Verify error' });
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
      return res.status(401).json({ success: false, message: 'Please verify first' });
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    console.log("🔢 NEW OTP:", otp);

    res.status(200).json({
      success: true,
      message: "OTP resent"
    });

  } catch (err) {
    console.error("❌ Resend Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};