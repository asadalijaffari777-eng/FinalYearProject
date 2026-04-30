const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    authProvider:{
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        default: null
    },
    token:{
        type: String,
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpires: Date,
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
})

module.exports = mongoose.model('User', UserSchema);