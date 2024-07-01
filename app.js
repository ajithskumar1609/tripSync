/* Express configuration*/
import express from 'express';
import morgan from 'morgan';
import ejsMate from 'ejs-mate';
import cookieParser from 'cookie-parser';
import rateLimiter from 'express-rate-limit';
import mongoSanitization from 'express-mongo-sanitize';
import hpp from 'hpp';
import session from 'express-session';
import compression from 'compression';
// import helmet from 'helmet';
// import ejs from 'ejs';
// import xss from 'xss-clean';

import indexRouter from './Routes/index.js';
import authRouter from './Routes/authRoute.js';
import userRouter from './Routes/userRoute.js';
import tourRouter from './Routes/tourRoute.js';
import reviewRouter from './Routes/reviewRoute.js';
import categoryRouter from './Routes/categoryRoute.js';
import wishListRouter from './Routes/wishListRoute.js'
import bookingRouter from './Routes/bookingRoute.js';
import viewRouter from './Routes/viewRoute.js';

import AppError from './Utils/AppError.js';
import globalErrorHandler from './Controller/errorController.js';

// START EXPRESS APPLICATION
const app = express();

// security http header
// app.use(helmet()); //! not allowed in axios cdn

if (process.env.NODE_ENV === 'Development') {
    app.use(morgan('dev'));
}

// Serve Static file
app.use(express.static('./public'));

// set layout
app.engine('ejs', ejsMate);

// set template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Body parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// COMPRESS THE RESPONSE TEXT 
app.use(compression());


// express session config
app.use(
    session({
        secret: 'secret key',
        resave: false,
        saveUninitialized: false,
    }),
);

// Data Sanitization against No-Sql query Injection
app.use(mongoSanitization());

// Data Sanitization against xss
// app.use(xss()); //! not allowed in axios cdn

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
app.use('/', viewRouter);
app.use('/test', indexRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/wishList', wishListRouter);
app.use('/api/v1/booking', bookingRouter);

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
