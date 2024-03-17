const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/appError');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');


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
        //Not to let users to register as administrator
        role: "user",
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


exports.restrictTo = (...roles) => {
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError("You do not have permission to perform this action!", 403));
        }

        next();
    }
}


exports.forgotPassword = catchAsync( async(req, res, next) => {
    //Get user based on Email
    let user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new appError("Please provide valid email!", 404));
    }

    //Generate random reset token
    let resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false}); 

    //Send it to user email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `In case you forgot your password, please follow the LINK:\n${resetURL}\nOtherwise just ignore this message.`;

    try{
        await sendEmail(
            {
                email: user.email,
                subject: 'Your password reset link (Valid for 10 minutes!)',
                message: message
            }
        )

        res.status(200).json({
            status: "Success",
            message: "Token sent to email!"
        });

    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false}); 

        next(new appError('Something went wrong with sending reset link, try again later!', 500))
    }

    

    

})


exports.resetPassword = catchAsync(async(req, res, next)=> {});