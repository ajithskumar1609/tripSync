import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your full name'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter a  email address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        min: [8, 'A password above in 8'],
        max: [15, 'A password below in 15'],
        required: [true, 'Please enter a password'],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please enter a confirm password'],
        validate: {
            validator: function (value) {
                return this.password === value;
            },
        },
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'lead-guide'],
        default: 'user',
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    otp: {
        type: String,
    },
    otpExpireIn: Date,
    isActive: {
        type: Boolean,
        default: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpireIn: Date,
});

userSchema.pre('save', async function (next) {
    // is modified password
    if (!this.isModified('password')) return next();
    // console.log(this.isModified('password'));
    //encrypt  password
    const saltCount = 12;
    this.password = await bcrypt.hash(this.password, saltCount);

    // remove passwordConfirm
    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// change password after the token was issued

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changeTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );

        return JWTTimeStamp < changeTimeStamp; // 100 < 200 true
    }

    // False , not password Changed

    return false;
};

// resetToken

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpireIn = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
