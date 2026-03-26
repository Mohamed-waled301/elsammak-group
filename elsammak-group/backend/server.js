require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));

// Connect DB وبعدين شغل السيرفر
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();