import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';

// eslint-disable-next-line import/no-named-as-default
import User from '../Model/userModel.js';
import Email from '../Utils/Email.js';

import catchAsync from '../Utils/CatchAsync.js';
import AppError from '../Utils/AppError.js';

// jwt sign token

const signToken = (user) => {
    const payLoad = {
        id: user.id,
        name: user.name,
    };
    const token = jwt.sign(payLoad, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    });

    return token;
};

// Send Response

const createSendToken = (statusCode, user, res) => {
    const token = signToken(user);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'Success',
        token,
        data: user,
    });
};

export const signup = catchAsync(async (req, res) => {
    // 1) Create New User
    const newUser = await User.create(req.body);
    const otpGenerate = Math.floor(100000 + Math.random() * 900000).toString();

    newUser.otp = crypto.createHash('sha256').update(otpGenerate).digest('hex');
    newUser.otpExpireIn = Date.now() + 10 * 60 * 1000;

    await newUser.save({ validateBeforeSave: false });

    await new Email(newUser).sendOtp(otpGenerate);
    //signToken & Response
    res.status(200).json({
        status: 'Success',
        message: 'Otp sent Successfully',
    });
});
export const verifyOtp = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new AppError('Please provide email and Otp', 401));
    }

    const currentUser = await User.findOne({ email: email });
    console.log(currentUser);

    if (!currentUser) {
        return next(new AppError('There is no user with  email address', 404));
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    //console.log(hashedOtp);
    //console.log(currentUser.otp);

    if (currentUser.isActive) {
        return next(
            new AppError(
                'User already exit \n  Please choose a different username or email address',
                409,
            ),
        );
    }
    if (currentUser.otp === hashedOtp && currentUser.otpExpireIn > Date.now()) {
        currentUser.isActive = true;
        currentUser.otp = undefined;
        currentUser.otpExpireIn = undefined;
        await currentUser.save({ validateBeforeSave: false });

        await new Email(currentUser).sendWelcome();

        createSendToken(200, currentUser, res);
    } else {
        res.status(404).json({
            status: 'fail',
            message: 'invalid otp',
        });
    }
});

export const resendOtp = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        console.log('not email');
    }

    const currentUser = await User.findOne({ email: email });

    if (!currentUser) {
        return next(new AppError('There is no user with  email address', 404));
    }

    if (currentUser.isActive) {
        return next(
            new AppError(
                'User already exit \n Please choose a different username or email address',
                409,
            ),
        );
    }

    const otpGenerate = Math.floor(100000 + Math.random() * 900000).toString();

    currentUser.otp = crypto
        .createHash('sha256')
        .update(otpGenerate)
        .digest('hex');
    currentUser.otpExpireIn = Date.now() + 10 * 60 * 1000;

    await currentUser.save({ validateBeforeSave: false });

    await new Email(currentUser).sendOtp(otpGenerate);

    res.status(200).json({
        status: 'Success',
        message: 'Otp send successfully',
    });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    //1) check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and Password', 401));
    }

    const currentUser = await User.findOne({
        email: email,
        isActive: true,
    }).select('+password');
    // 2) check if user exist and password is correct
    if (
        !currentUser ||
        !(await currentUser.correctPassword(password, currentUser.password))
    ) {
        return next(new AppError('Incorrect email or password', 401));
    }
    currentUser.password = undefined;
    // send Response
    createSendToken(200, currentUser, res);
});

export const logout = catchAsync((req, res, next) => {
    res.cookie('jwt', 'jwtToken', {
        expires: new Date(Date.now() + 10 * 60 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        status: 'Success',
    });
});

export const protect = catchAsync(async (req, res, next) => {
    //  Getting token and check of its there
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
        // console.log(token);
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // token is exist
    if (!token) {
        return next(
            new AppError('You are not logged in, Please log in to get Access'),
        );
    }

    // verify token

    const decodeToken = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET_KEY,
    );

    // check if user still exist
    const currentUser = await User.findById(decodeToken.id);

    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist',
                401,
            ),
        );
    }

    // console.log(decodeToken);

    // Check if your changed Password after the token was issued
    if (currentUser.changePasswordAfter(decodeToken.iat)) {
        return next(
            new AppError(
                'User recently password changed!,Please log in again',
                401,
            ),
        );
    }

    // Grand Access
    req.user = currentUser;
    next();
});

export const isLoggedIn = async (req, res, next) => {
    // verify
    try {
        if (req.cookies.jwt) {
            const decodeToken = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET_KEY,
            );

            // user exit
            const currentUser = await User.findById(decodeToken.id);

            if (!currentUser) {
                return next();
            }

            // check change password after jwt token issued
            if (currentUser.changePasswordAfter(decodeToken.iat)) {
                return next();
            }
            // the logged user;
            req.locals.user = currentUser;
            return next();
        }
    } catch (err) {
        next();
    }
    next();
};

// Restrict Route

export const restrictedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403,
                ),
            );
        }
        next();
    };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
    // email exist
    const { email } = req.body;

    if (!email) {
        return next(new AppError('provide a email address', 404));
    }
    // user exist
    const currentUser = await User.findOne({ email: email });

    if (!currentUser) {
        return next(new AppError('There is no user with email address'));
    }
    // resetToken
    const resetToken = currentUser.createPasswordResetToken();

    await currentUser.save({ validateBeforeSave: false });

    // Send email
    try {
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
        // console.log(resetUrl);
        await new Email(currentUser, resetUrl).sendResetPassword();
        res.status(200).json({
            status: 'Success',
            message: 'Take sent to email',
        });
    } catch (err) {
        currentUser.passwordResetToken = undefined;
        currentUser.passwordResetExpireIn = undefined;
        await currentUser.save({ validateBeforeSave: false });
        res.status(500).json({
            status: 'error',
            message: err,
        });
    }
});
export const resetPassword = catchAsync(async (req, res, next) => {
    // check resetToken exit
    const resetToken = req.params.token;
    // hashed reset Token
    const hashedResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // Get user and check
    const currentUser = await User.findOne({
        passwordResetToken: hashedResetToken,
        passwordResetExpireIn: { $gt: Date.now() },
    });

    console.log(currentUser);
    if (!currentUser) {
        return next(new AppError('Invalid token or expired', 401));
    }
    // change Password
    currentUser.password = req.body.password;
    currentUser.confirmPassword = req.body.confirmPassword;
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetExpireIn = undefined;
    await currentUser.save();

    // update changePasswordAt property for the user

    // send jwt token
    createSendToken(200, currentUser, res);
});

export const updateMyPassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // user exist
    const currentUser = await User.findById(req.user.id).select('+password');

    // check if password correct
    if (
        !(await currentUser.correctPassword(
            currentPassword,
            currentUser.password,
        ))
    ) {
        return next(new AppError('Your current password is wrong', 401));
    }

    // update new password
    currentUser.password = newPassword;
    currentUser.confirmPassword = confirmPassword;

    await currentUser.save();

    // send token
    createSendToken(200, currentUser, res);
});
