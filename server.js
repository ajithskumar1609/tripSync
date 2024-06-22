/* Server Configuration */
import chalk from 'chalk';
import 'dotenv/config';

import app from './app.js';
import connectDB from './Config/db.js';

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

if (process.env.NODE_ENV === 'Development') {
    console.log(chalk.yellow.bold(process.env.NODE_ENV));
} else {
    console.log(chalk.gray.bold(process.env.NODE_ENV));
}

// connect MongoDb
connectDB();

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(chalk.bgBlue(`Server running on port ${PORT}`));
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
