const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/appError');

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
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });

    const token = createToken(newUser._id);

    res.status(200).json({
        status: "Success created",
        token,
        data: {
            user: newUser
        },
    });
});


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

exports.protect = catchAsync( async(req, res, next) => {
    //Get token and check it.
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token){
        return next(new appError('Please login to see this content!', 401));
    }

   
    //Verification token.
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);


    //Check if user exists.

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new appError("The User, which this token belongs to, doesn't exist!", 401));
    }

    //Check if user changed password after the token was issued.
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(
            new appError('User recently changed password! Please log in again.', 401)
        );
    }


    req.user = currentUser;

    next()
})