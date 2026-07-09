const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (user) =>{
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            role: user.role
        },
        SECRET_KEY,
        {
            expiresIn: '5m'
        }
    )
}

module.exports = generateToken;