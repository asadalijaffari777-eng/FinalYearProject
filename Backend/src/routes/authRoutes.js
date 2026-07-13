const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authController = require('../controller/authController');
const verifyToken = require('../middleware/authMiddleware');
const passport = require('passport');
const generateToken = require('../utils/jwt')


// Your existing routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify', authController.verify);


// router.get('/dashboard', verifyToken, authController.dashboard);
router.get('/dashboard', verifyToken, authController.dashboard);

router.get('/google', (req, res, next) => {
  const hasGoogleConfig = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  if (!hasGoogleConfig) {
    return res.status(500).json({ message: 'Google OAuth not configured: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing on server' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res, next);
})

router.get(
    '/google/callback',
    (req, res, next) => {
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({ message: 'Google OAuth not configured on server' });
      }
      passport.authenticate('google', { session: false, failureRedirect: '/' })(req, res, next);
    },
    (req, res) => {
        const token = generateToken(req.user);
        res.cookie('token', token,
            {
                httpOnly: true,
                maxAge: 5 * 60 * 1000
            }
        );
        const frontendUrl = process.env.CORS_ORIGIN 
          ? (Array.isArray(process.env.CORS_ORIGIN) ? process.env.CORS_ORIGIN[0] : process.env.CORS_ORIGIN.split(',')[0])
          : `${req.protocol}://${req.get('host')}`
        res.redirect(`${frontendUrl}/dashboard`)
    }
);

module.exports = router;