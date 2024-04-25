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
const sendErrorDevelopment = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack: err.stack,
    });
};

// Production Error
const sendErrorProduction = (err, res) => {
    // is operational error - trusted error - send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // programming error or unknown error: don't leak error details
    // 1)Log Error
    console.error('Error 🔥', err);

    // Send generic  message

    res.status(500).json({
        status: 'error',
        message: 'Some thing went wrong',
    });
};

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDevelopment(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        console.log(error.path);

        if (error.path === '_id') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error._message === 'Validation failed')
            error = handleValidationErrorDB(error);
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpireError(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        sendErrorProduction(error, res);
    }
};
