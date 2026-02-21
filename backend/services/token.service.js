require('dotenv').config();

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const secretKey = process.env.JWT_SECRET;

exports.generateToken = (userPayload, expiresIn = '15m') => {
    const uniqueTokenId = uuidv4(); 
    
    return jwt.sign(
        { ...userPayload, jti: uniqueTokenId }, 
        secretKey, 
        { expiresIn }
    );
};