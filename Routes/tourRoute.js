import express from 'express';

import {
    getAllTour,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    uploadTourImage,
    resizeTourImage,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
} from '../Controller/tourController.js';
import { protect, restrictedTo } from '../Controller/authController.js';

import reviewRouter from './reviewRoute.js';

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTour);

// router.use(protect, restrictedTo('admin', 'lead-guide', 'guide'));

router
    .route('/tour-stats')
    .get(protect, restrictedTo('admin', 'lead-guide', 'guide'), getTourStats);

router
    .route('/monthly-plan/:year')
    .get(protect, restrictedTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
    .route('/')
    .get(getAllTour)
    .post(protect, restrictedTo('admin', 'lead-guide'), createTour);

router
    .route('/:id')
    .get(protect, getTour)
    .patch(
        protect,
        restrictedTo('admin', 'lead-guide'),
        uploadTourImage,
        resizeTourImage,
        updateTour,
    )
    .delete(protect, restrictedTo('admin', 'lead-guide'), deleteTour);

export default router;
