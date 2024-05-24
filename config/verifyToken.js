const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('./jwtToken');


const verifyToken = (token, id)=>{
  
  jwt.verify(token, process.env.JWT_SECRET,(err, decoded)=>{
    console.log(id, decoded.id)
    if(err){
        throw new Error('There is something wrong with refresh token');
    }
    const accesstoken = generateToken(id);
    console.log(accesstoken)
    return accesstoken
  });
};

module.exports = verifyToken;