import fs from 'fs';
import 'dotenv/config';
import mongoose from 'mongoose';
import chalk from 'chalk';

import Tour from '../Model/tourModel.js';
import User from '../Model/userModel.js';
import Review from '../Model/reviewModel.js';
import Category from '../Model/categoryModel.js';

const dbURL = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);
mongoose
    .connect(dbURL)
    .then(() =>
        console.log(chalk.greenBright.bold('Database connected successfully')),
    );

const tourData = JSON.parse(
    // eslint-disable-next-line no-undef
    fs.readFileSync('dev-data/tour.json', 'utf-8'),
);
const userData = JSON.parse(fs.readFileSync('dev-data/users.json', 'utf-8'));
const reviewData = JSON.parse(
    fs.readFileSync('dev-data/reviews.json', 'utf-8'),
);
const categoryDate = JSON.parse(
    fs.readFileSync('dev-data/category.json', 'utf-8'),
);

const importData = async () => {
    try {
        await Tour.create(tourData);
        await User.create(userData, { validateBeforeSave: false });
        await Review.create(reviewData);
        await Category.create(categoryDate);
        console.log(chalk.redBright.bold('Database data loaded Successfully!'));
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        await Category.deleteMany();
        console.log(chalk.redBright.bold('Data deleted Successfully!'));
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
