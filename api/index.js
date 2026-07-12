const mongoose = require('mongoose');

const dbPromise = mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = require('../Backend/src/app');

app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) await dbPromise;
    next();
  } catch {
    res.status(503).json({ message: 'Database not connected' });
  }
});

module.exports = app;
