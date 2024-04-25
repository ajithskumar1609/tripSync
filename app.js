/* Express configuration*/
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitization from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import indexRouter from './Routes/index.js';
import authRouter from './Routes/authRoute.js';
import userRouter from './Routes/userRoute.js';
import tourRouter from './Routes/tourRoute.js';
import reviewRouter from './Routes/reviewRoute.js';
import cartRouter from './Routes/cartRoute.js';

import AppError from './Utils/AppError.js';
import globalErrorHandler from './Controller/errorController.js';

const app = express();

// security http header
app.use(helmet());

if (process.env.NODE_ENV === 'Development') {
    app.use(morgan('dev'));
}

// Serve Static file
app.use(express.static('public'));

// Body parser
app.use(express.json());

// Data Sanitization against No-Sql query Injection
app.use(mongoSanitization());

// Data Sanitization against xss
app.use(xss());

//  Use the hpp middleware to prevent parameter pollution
app.use(
    hpp({
        whitelist: ['price', 'duration', 'maxGroupSize', 'difficulty'],
    }),
);

// Use CookieParser Middleware
app.use(cookieParser());

// Rate limiting Options

const limiter = rateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'To many requests from this Ip,Please try again in a hour',
});

// use limiter middleware
app.use('/api', limiter);

// Mounting Route
app.use('/', indexRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/carts', cartRouter);

// Test Api
app.get('/api', (req, res) => {
    res.status(200).json({
        status: 'Success',
        message: 'API HOT🔥',
    });
});

// Unhandled route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

// Handling Global MiddleWare
app.use(globalErrorHandler);

export default app;
