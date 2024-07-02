import chalk from 'chalk';
import mongoose from 'mongoose';

const DB_URL = process.env.MONGO_URL.replace(
    '<PASSWORD>',
    process.env.MONGO_URL_PASSWORD,
);

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log(chalk.green.italic.bold('MongoDB connected ....'));
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

export default connectDB;
