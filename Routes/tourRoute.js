import express from 'express';

import {
    getAllTour,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    searchTours,
} from '../Controller/tourController.js';
import { protect, restrictedTo } from '../Controller/authController.js';

import reviewRouter from './reviewRoute.js';

const router = express.Router();

// GET REVIEW NESTED ROUTE : GET -> tours/:tourId/reviews
// GET REVIEW NESTED ROUTE : GET -> tours/:tourId/reviews/:reviewId

// router
//     .route('/:tourId/reviews')
//     .post(protect, restrictedTo('user'), createReview);

router.use('/:tourId/reviews', reviewRouter);

router.get('/search', searchTours);

router
    .route('/')
    .get(getAllTour)
    .post(protect, restrictedTo('admin', 'lead-guide'), createTour);

router
    .route('/:id')
    .get(protect, getTour)
    .patch(restrictedTo('admin', 'lead-guide'), updateTour)
    .delete(restrictedTo('admin', 'lead-guide'), deleteTour);

export default router;
