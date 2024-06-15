const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailCtrl');
const crypto = require('crypto');
// Create a user
const createUser =  asyncHandler(async(req, res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email});

    if(!findUser){
        // Create a new user
         const newUser = await User.create(req.body);
         res.json(newUser);
    }else{
        // User already Exists
         throw new Error('Already User Exists');
    }

});

// login a user======
const loginUserCtrl = asyncHandler(async (req, res)=>{

    const {email, password } = req.body
    // check if user exists or not
    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser?._id,
            {
                refreshToken:refreshToken
            },
            {
                new:true
            }
        );

     res.cookie('refreshToken', refreshToken,{
        httpOnly:true,
        maxAge: 72 * 60 * 60 * 1000,
     });

     res.json({
        id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser.id)
     });
    }else{
        throw new Error('Invalid Credentials');
    };
});

// handle refresh token 
const handleRefreshToken = asyncHandler(async(req, res)=>{
 const cookie = req.cookies;
 if(!cookie?.refreshToken){
   throw new Error('No Refresh Token in cookies');
 };
 const refreshToken = cookie.refreshToken;

 const user = await User.findOne({refreshToken});

 if(!user){throw new Error('No Refresh token present in db or not Matched')}
 jwt.verify(refreshToken, process.env.JWT_SECRET,(err, decoded)=>{
    if(err || user?.id !== decoded.id ){
        throw new Error('There is something wrong with refresh token');
    }
    const accessToken = generateToken(user?.id);
    res.json({accessToken})
  });
});

// logout functionality

const logOut = asyncHandler(async(req, res)=>{
 const cookie = req.cookies;
 if(!cookie?.refreshToken){
   throw new Error('No Refresh Token in cookies');
 };
 const refreshToken = cookie.refreshToken;
 const user = await User.findOne({refreshToken});

 if(!user){
    res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true
    });
    return res.sendStatus(204); // forbidden
 }
 await User.findOneAndUpdate({refreshToken}, {
    refreshToken: "",
 },{
    new:true
 });

 res.clearCookie('refreshToken',{
    httpOnly:true,
    secure:true
});
 res.sendStatus(204); // forbidden

});



// Update a user
const updatedaUser = asyncHandler(async(req, res)=>{
   const { _id } = req.user;
   validateMongoDbId(_id);
    try {
        const updatedaUser = await User.findByIdAndUpdate(
          _id,
        {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile :req?.body?.mobile
        },
        {
            new:true
        }
    );
    res.json({
        updatedaUser
    });
    } catch (error) {
        throw new Error(error)
        
    };
})

// Get all user
const getAllUser = asyncHandler(async(req, res)=>{

    try {
        const getUsers = await User.find().sort({_id:-1});
        res.json(getUsers);

    } catch (error) {
        throw new Error(error);
    }
})

// Get a single user

const getaUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaUser = await User.findById({_id:id});
        res.json({
            getaUser,
        });
    } catch (error) {
        throw new Error(error);
        
    }

});

// Delete a user

const deleteaUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });
    } catch (error) {
        throw new Error(error);
        
    }

});

// bolck a user
const blockUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(
        id,
        {
        isBlocked:true
        },
        {
         new: true
        }
    );
    res.json({
        message: 'User Blocked'
    });
    } catch (error) {
        throw new Error(error);
    }
});

// unblock a user

const unblockUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
        id,
        {
        isBlocked:false
        },
        {
         new: true
        }
    );
    res.json({
        message: 'User Unblocked'
    });
    } catch (error) {
        throw new Error(error);
    }
});

// update password
const updatePassword = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPasword = await user.save()
        res.json(updatedPasword);
    }else{
        res.json(user);
    }
});

const forgetPasswordToken = asyncHandler(async(req, res)=>{
 const {email} = req.body;
 const user = await User.findOne({email});
 if(!user) throw new Error('User not found with this email');
 try {
    const token  = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. 
    <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`;
    const data = {
        to: email,
        text:'Hey User',
        subject:'Forgot Password Link',
        html: resetURL
    }
    sendEmail(data);
    res.json(token);
    
 } catch (error) {
    throw new Error(error);
 };

});

const resetPassword = asyncHandler(async(req, res)=>{
 const {password} = req.body;
 const {token} = req.params;
 const hashedToken = crypto
 .createHash('sha256')
 .update(token)
 .digest('hex');
 const user = await User.findOne({
    passwordResetToken:hashedToken,
    passwordResetExpires:{ $gt:Date.now() }
 });

 if(!user) throw new Error('Token Exprired, Please try aain later');
  user.password = password;
  user.passwordResetToken= undefined;
  user.passwordResetExpires= undefined;
  await user.save()
  res.json(user);
});



module.exports = {
    createUser,
     loginUserCtrl,
      getAllUser, 
      getaUser, 
      deleteaUser,
      updatedaUser,
      blockUser,
      unblockUser,
      handleRefreshToken,
      logOut,
      updatePassword,
      forgetPasswordToken,
      resetPassword,
    };






















