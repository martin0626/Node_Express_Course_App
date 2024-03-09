const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/appError')

const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async(req, res, next) =>{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    // const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRES_IN
    // });

    const token = createToken(newUser._id);

    res.status(200).json({
        status: "Success created",
        token,
        data: {
            user: newUser
        },
    });
});

// TODO Fix IT!
exports.login = catchAsync(async(req, res, next) =>{
    
    const {email, password} = req.body;

    // Check email and password existing
    if(!email || !password){
        return next(new appError('Please provide email and password!', 400));
    }
    //Check if password is correct and user existing
    const user = await User.findOne({email}).select('+password');


    if (!user || !(await user.correctPassword(password, user.password))){
        return next(new appError('Incorrect email or password!', 401));
    }

    //Send token to the client
    const token = createToken(user._id);

    res.status(200).json({
        status: "Success",
        token
    });
});