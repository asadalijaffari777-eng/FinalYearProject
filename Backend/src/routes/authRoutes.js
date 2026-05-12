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

router.get(
    '/google',
    passport.authenticate('google', {scope: ['profile', 'email'], prompt: 'select_account'})
)

router.get(
    '/google/callback',
    passport.authenticate('google', {session: false, failureRedirect: '/'}),
    (req, res)=>{
        const token = generateToken(req.user);
        res.cookie('token', token,
            {
                httpOnly: true,
                maxAge: 5 * 60 * 1000
            }
        );
        res.redirect('http://localhost:5173/dashboard')
    }
);

module.exports = router;