const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Email validation regex
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    console.log("🔥 Register Hit");

    const { name, email, password, nationalId, phone, governorate, city } = req.body;

    if (!name || !email || !password || !nationalId || !phone || !governorate || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password,
      nationalId,
      phone,
      governorate,
      city,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000
    });

    console.log("✅ User created");

    // Send OTP to email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification OTP',
        message: `Your OTP for email verification is: ${otp}\n\nThis OTP will expire in 5 minutes.`
      });
    } catch (emailErr) {
      console.error("⚠️ Email sending failed:", emailErr.message);
      // Don't fail the registration if email fails, but log it
    }

    res.status(201).json({
      success: true,
      message: "User registered. Please check your email for OTP"
    });

  } catch (err) {
    console.error("❌ Register Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required"
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
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
    res.status(500).json({ success: false, message: "Verify error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Verify your email first"
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login error" });
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
        message: "Email required"
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
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

    console.log("🔢 OTP:", otp);

    // Send OTP to email
    try {
      await sendEmail({
        email: user.email,
        subject: 'OTP Resend - Email Verification',
        message: `Your new OTP for email verification is: ${otp}\n\nThis OTP will expire in 5 minutes.`
      });
    } catch (emailErr) {
      console.error("⚠️ Email sending failed:", emailErr.message);
      // Still return success as OTP was generated, but log the email failure
    }

    res.status(200).json({
      success: true,
      message: "OTP resent to your email"
    });

  } catch (err) {
    console.error("❌ Resend Error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};