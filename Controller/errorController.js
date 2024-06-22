/* eslint-disable node/no-unsupported-features/es-syntax */
import AppError from '../Utils/AppError.js';

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}:${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
    const value = err.keyValue.name;
    const message = `Duplicate field value:${value}`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const error = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data ${error}`;
    return new AppError(message, 400);
};

const handleJWTExpireError = () =>
    new AppError('You token has expired,Please log in again!', 401);

const handleJWTError = () =>
    new AppError('Invalid token,Please log in again!', 401);

// Development Error
const sendErrorDevelopment = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            err: err,
            message: err.message,
            stack: err.stack,
        });
    }

    // B) RENDERED WEBSITE
    console.error('ERROR 🔥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        message: err.message,
    });
};

// Production Error
const sendErrorProduction = (err, req, res) => {
    // A)API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational,trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }

        //B) programming or other unknown error: don't leak error details
        //1) log error
        console.error('ERROR 🔥', err);
        //2) send generic message
        return res.status(500).json({
            status: 'error',
            message: 'something went very wrong!',
        });
    }

    //B) RENDERED WEBSITE
    // A) Operational,trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'something went wrong',
            message: err.message,
        });
    }

    //B)programming or other unknown error: don't leak error details

    //1) log error
    console.error('ERROR 🔥', err);
    //send Generic message
    return res.status(err.statuscode).render('error', {
        title: 'Some thing went wrong!',
        message: 'Please try again later',
    });
};

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDevelopment(err, req, res);
        console.log(err);
    } else if (process.env.NODE_ENV === 'production') {
        // console.log(err.message, '🔥');
        let error = { ...err };
        error.message = err.message;
        // console.log(error);

        if (error.path === '_id') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error._message === 'Validation failed') {
            error = handleValidationErrorDB(error);
        }
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpireError(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        sendErrorProduction(error, req, res);
    }
};
