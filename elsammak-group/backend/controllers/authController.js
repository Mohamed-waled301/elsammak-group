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

    console.log("🟡 Before save");

    await user.save();

    console.log("🟢 User saved");

    res.status(201).json({
      success: true,
      message: 'User registered'
    });

  } catch (err) {
    console.error("❌ Register Error FULL:", err);

    res.status(500).json({
      success: false,
      message: 'Error in registration',
      error: err.message,
      stack: err.stack
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
      message: 'User verified successfully',
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
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

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    console.log("🔥 FORGOT PASSWORD HIT");

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email'
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `Reset your password using this link:\n\n${resetUrl}`;

    console.log("📧 قبل الإرسال");

    await sendEmail(
      user.email,
      'Password Reset Token',
      message
    );

    console.log("📧 بعد الإرسال");

    res.status(200).json({
      success: true,
      message: 'Email sent'
    });

  } catch (err) {
    console.error("❌ Forgot Error:", err);
    res.status(500).json({
      success: false,
      message: 'Email could not be sent'
    });
  }
};
// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetToken: resetPasswordToken,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Reset password error' });
  }
};
// ================= RESEND OTP =================
// ================= RESEND OTP =================
exports.resendOTP = async (req, res) => {
  try {
    console.log("🔥 Resend OTP Hit");
    console.log("BODY:", req.body);

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

    // 🔥 أهم سطر (يمنع الكراش)
    await user.save({ validateBeforeSave: false });

    console.log("🔢 NEW OTP:", otp);

    // ❌ اقفل الإيميل خالص مؤقتًا
    // await sendEmail(...)

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully"
    });

  } catch (err) {
    console.error("❌ Resend OTP Error FULL:", err);

    return res.status(500).json({
      success: false,
      message: "Error resending OTP",
      error: err.message
    });
  }
};