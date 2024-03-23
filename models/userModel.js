const mongoose = require('mongoose');
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true, "User must have name!"],
        unique: true,
        trim: true,
        maxlength: [40, 'A User must have less or equal then 40 symbols.'],
        minlength: [4, 'A User must have at least 4 symbols.']
    },
    email: {
        type: String,
        require: [true, "Email is already exist!"],
        unique: true,
        trim: true,
        validate: {
            validator: function(email){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            },
            message: 'Email: ({VALUE}) is not valid!'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'guide', 'lead-guide'],
        default: 'user'
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        require: [true, "Please enter password!"],
        minlength: [8, 'Password must have at least 8 symbols.'],
        select: false
    },
    passwordConfirm: {
        type: String,
        require: [true, "Please enter password!"],
        validate: {
            validator: function(pass){
                return pass === this.password
            },
            message: 'Password does not match!'
        }
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
})


userSchema.pre("save", async function(next){
    // Only run function if password is modified.
    if (!this.isModified('password')) return next();

    // Encrypt password, not to be in plane text for security.
    this.password = await bcryptjs.hash(this.password, 12);
    // Delete passwordConfirm field, because it is not needed after moving through validation
    this.passwordConfirm = undefined;
    
    next();
})

userSchema.pre("save", async function(next){
    // Only run function if password is modified.
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});


userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcryptjs.compare(candidatePassword, userPassword)
}


userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if (this.passwordChangedAt){
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 
            10
        )

        return JWTTimestamp < changedTimeStamp;
    }

    return false;
}


userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


const User = mongoose.model('User', userSchema);
module.exports = User; 