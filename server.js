/* Server Configuration */
import chalk from 'chalk';
import 'dotenv/config';

import app from './app.js';
import connectDB from './Config/db.js';

if (process.env.NODE_ENV === 'Development') {
    console.log(chalk.yellow.bold(process.env.NODE_ENV));
} else {
    console.log(chalk.gray.bold(process.env.NODE_ENV));
}

// connect MongoDb
connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(chalk.bgBlue(`Server running on port ${PORT}`));
});
