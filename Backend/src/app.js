const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const passport = require("passport");
const manufacturerRoutes = require('./routes/manufacturerRoutes');

require('./config/passport'); 

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use('/fyp', authRoutes);

app.use('/fyp/manufacturers', manufacturerRoutes);

module.exports = app;