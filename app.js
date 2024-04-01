/* Express configuration*/
import express from 'express';
import morgan from 'morgan';

import indexRouter from './Routers/index.js';

const app = express();

if (process.env.NODE_ENV === 'Development') {
    app.use(morgan('dev'));
}

// Serve Static file
app.use(express.static('public'));

// Body parser
app.use(express.json());

// Mounting Route
app.use('/', indexRouter);

// Test Api
app.get('/api', (req, res) => {
    res.status(200).json({
        status: 'Success',
        message: 'API HOT🔥',
    });
});

export default app;
