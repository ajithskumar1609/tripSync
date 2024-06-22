import multer from 'multer';
import sharp from 'sharp';

import Tour from '../Model/tourModel.js';
import catchAsync from '../Utils/CatchAsync.js';
import factoryHandler from './handleFactory.js';

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
});

export const uploadTourImage = upload.fields([
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 3,
    },
]);

export const resizeTourImage = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpg`;

    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/tour/${req.body.imageCover}`);

    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, index) => {
            const fileName = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/images/tour/${fileName}`);

            req.body.images.push(fileName);
        }),
    );
    next();
});

export const getAllTour = factoryHandler.getAll(Tour);

export const createTour = factoryHandler.createOne(Tour);

export const getTour = factoryHandler.getOne(Tour, 'reviews', 'category');

export const updateTour = factoryHandler.updateOne(Tour);

export const deleteTour = factoryHandler.deleteOne(Tour);

export const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
    next();
};

export const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gt: 4.5 } },
        },
        {
            $group: {
                // _id: null,
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
    ]);

    res.status(200).json({
        status: 'Success',
        results: stats.length,
        data: stats,
    });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const { year } = req.params;
    console.log(year);

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                'startDates.date': {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates.date' },
                numOfStartTours: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numOfStartTours: -1 },
        },
    ]);

    res.status(200).json({
        status: 'Success',
        results: plan.length,
        data: plan,
    });
});
