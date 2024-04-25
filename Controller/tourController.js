import Tour from '../Model/tourModel.js';
import catchAsync from '../Utils/CatchAsync.js';
import factoryHandler from './handleFactory.js';

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
