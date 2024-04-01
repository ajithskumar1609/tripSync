import chalk from 'chalk';
import mongoose from 'mongoose';

const MONGO_URI = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(chalk.green.italic.bold('MongoDB connected ....'));
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

export default connectDB;
