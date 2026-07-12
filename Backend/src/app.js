const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const passport = require("passport");
const manufacturerRoutes = require('./routes/manufacturerRoutes');
const itemRoutes = require('./routes/itemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');

require('./config/passport'); 

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.DATABASE_URL);
    } catch (err) {
      return res.status(503).json({ message: 'Database connection failed', error: err.message });
    }
  }
  next();
});

app.use('/fyp', authRoutes);

app.use('/fyp/manufacturers', manufacturerRoutes);

app.use('/fyp/items', itemRoutes);

app.use('/fyp/admin', adminRoutes);

app.use('/fyp/chat', chatRoutes);

module.exports = app;