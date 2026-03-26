require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Test route مهم جدًا
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Test route تاني
app.get("/test", (req, res) => {
  res.json({ message: "API works ✅" });
});

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));

// ❌ Error handler (مهم عشان مايكراش)
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message
  });
});

const PORT = process.env.PORT || 8080;

// ✅ شغل السيرفر بعد DB
connectDB()
  .then(() => {
    console.log("DB connected, starting server...");

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB CONNECTION FAILED:", err);
  });