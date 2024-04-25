import ApiFeatures from '../Utils/ApiFeatures.js';
import AppError from '../Utils/AppError.js';
import catchAsync from '../Utils/CatchAsync.js';

export const setTourUserIds = (req, res, next) => {
    if (!req.body.tourId) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
};

const factoryHandler = {
    getAll: (Model) =>
        catchAsync(async (req, res, next) => {
            let filter = {};

            if (req.params.tourId) filter = { tour: req.params.tourId };

            const features = new ApiFeatures(Model.find(filter), req.query)
                .filter()
                .sort()
                .pagination()
                .fields();
            // const docs = await features.query.explain();
            const docs = await features.query;

            res.status(200).json({
                status: 'Success',
                results: docs.length,
                data: docs,
            });
        }),
    createOne: (Model) =>
        catchAsync(async (req, res, next) => {
            if (!req.body.tour) req.body.tour = req.params.tourId;
            if (!req.body.user) req.body.user = req.user.id;

            const doc = await Model.create(req.body);

            res.status(201).json({
                status: 'Success',
                data: doc,
            });
        }),
    getOne: (Model, popOptions) =>
        catchAsync(async (req, res, next) => {
            let query = Model.findById(req.params.id);

            if (popOptions) {
                query = query.populate(popOptions);
            }

            const doc = await query;

            // const doc = await Model.findById(req.params.id).populate('reviews');

            if (!doc) {
                return next(
                    new AppError('No document found with that ID', 404),
                );
            }

            res.status(200).json({
                status: 'Success',
                data: doc,
            });
        }),
    updateOne: (Model) =>
        catchAsync(async (req, res, next) => {
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!doc) {
                return next(
                    new AppError('No document found with that ID', 404),
                );
            }

            res.status(200).json({
                status: 'Success',
                data: doc,
            });
        }),

    deleteOne: (Model) =>
        catchAsync(async (req, res, next) => {
            const doc = await Model.findByIdAndDelete(req.params.id);

            if (!doc) {
                return next(
                    new AppError('No document found with that ID', 404),
                );
            }

            res.status(204).json({
                status: 'Success',
                data: doc,
            });
        }),
};

export default factoryHandler;
