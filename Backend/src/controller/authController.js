const User = require('../models/User');
const generateToken = require('../utils/jwt');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });

    if (existUser) {
      if (existUser.isVerified) {
        return res.json({ success: false, message: "User already exists" });
      }

      if (existUser.otpExpires && existUser.otpExpires.getTime() > Date.now()) {
        return res.json({ success: false, messageRegister: 'Please verify your previous registration first' });
      }

      // Delete old unverified user
      await User.deleteOne({ email });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      isVerified: false,
      otp,
      otpExpires: new Date(Date.now() + 2 * 60 * 1000) // 2 mins
    });

    await newUser.save()

    try {
      await sendEmail(
          email,
          "Your OTP Code",
          `
          <p>You requested to log in to your account.</p>
          <p>Your one-time verification code is:<br><b>${otp}</b></p>
          <p>This code will expire in 2 minutes.</p>
          <p>If this was not you, we recommend changing your password immediately.</p>
          `
      )
    } catch (emailErr) {
      console.log('Email send error:', emailErr.message)
      return res.json({
        success: false,
        message: 'Failed to send OTP email. Verify EMAIL_USER/EMAIL_PASS in Vercel env vars.',
        error: emailErr.message
      })
    }

    return res.json({
      success: true,
      message: "User is registered",
      newUser: {username: newUser.username, email: newUser.email}
    });
  } catch (err) {
    console.log("This is the Registration error: ", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.login = async (req, res)=>{
  const {email, password} = req.body;

  try{
    const user = await User.findOne({email});
    if(!user) return res.json({success: false, message: 'Invalid user'});

    if(user.authProvider === 'google'){
      return res.json({
        sucess: false,
        message: 'The Account uses Google Login. Please sign in with Google'
      })
    }

    if(!user.isVerified){
      return res.json({
        success: false,
        message: 'Please verify user'
      })
    }

    if(!user.password){
      return res.json({
        success: false,
        message: 'Password is neccessary!'
      })
    };


    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)  return res.json({success: false, message: 'Invalid password'});

    const token = generateToken(user);
    try {
      await User.updateOne({ _id: user._id }, { token });
    } catch (e) {
      console.log('Token save error (non-fatal):', e.message);
    }

    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
      sameSite: isSecure ? 'none' : 'lax',
      path: '/',
      secure: isSecure,
    });

    return res.json({
      success: true,
      messageLogin: "User Found",
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role },
    });
  }catch(err){
    console.log('Login error: ', err);
    res.status(500).json({success: false, message: 'Server Error', error: err.message, stack: err.stack?.split('\n').slice(0,3).join(' | ')})
  }
}

exports.verify = async(req, res)=>{
  const {email, otp} = req.body;

  try{
      const user = await User.findOne({email});
      if(!user){
        return res.json({success: false, message: 'User not found'})
      }

      if (user.otp !== otp)
      return res.json({ success: false, message: 'Invalid OTP' });

      if(!user.otpExpires || user.otpExpires < new Date())
      return res.json({success: false, message: 'OTP expired'});

      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      const token = generateToken(user);
      await User.updateOne({ _id: user._id }, { token });
      const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 5 * 60 * 1000,
        sameSite: isSecure ? 'none' : 'lax',
        path: '/',
        secure: isSecure,
      });

      res.json({
        success: true,
        message: 'Email Verified',
        token
      })

  }catch(err){
    console.log("This is the verification error: ", err);
    res.status(500).json({success:false})
  }

}
// authController.js
exports.logout = async (req, res) => {
  try {
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: isSecure ? 'none' : 'lax',
      path: '/',
      secure: isSecure,
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Could not log out' });
  }
};

exports.dashboard = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });  // Remove success field, just send user data    
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
}
};

