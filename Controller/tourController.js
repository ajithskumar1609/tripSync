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

export const getTour = factoryHandler.getOne(Tour, 'reviews');

export const updateTour = factoryHandler.updateOne(Tour);

export const deleteTour = factoryHandler.deleteOne(Tour);

export const searchTours = catchAsync(async (req, res, next) => {
    const searchQuery = req.query.q;

    const regex = new RegExp(searchQuery, 'i');

    const allTours = await Tour.find({ name: regex });

    res.status(200).json({
        status: 'Success',
        results: allTours.length,
        data: allTours,
    });
});
