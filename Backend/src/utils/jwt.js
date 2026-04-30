const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (user) =>{
    return jwt.sign(
        {
            userId: user._id,
            email: user.email
        },
        SECRET_KEY,
        {
            expiresIn: '2m'
        }
    )
}

module.exports = generateToken;