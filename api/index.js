const mongoose = require('mongoose');

let dbPromise = mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

let app = null;

module.exports = async (req, res) => {
  if (!app) {
    await dbPromise;
    app = require('../Backend/src/app');
  }
  return app(req, res);
};
