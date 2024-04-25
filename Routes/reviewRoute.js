import express from 'express';

import {
    getAllReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview,
} from '../Controller/reviewController.js';
import { protect, restrictedTo } from '../Controller/authController.js';
import { setTourUserIds } from '../Controller/handleFactory.js';

const router = express.Router({ mergeParams: true });

// CREATE REVIEW NESTED ROUTE : POST -> tours/:tourId/reviews

// GET REVIEW NESTED ROUTE : GET -> tours/:tourId/reviews -> the tourId get all reviews

//? all route protect

router.use(protect);

router
    .route('/')
    .get(getAllReviews)
    .post(restrictedTo('user'), setTourUserIds, createReview);
router
    .route('/:id')
    .get(getReview)
    .patch(restrictedTo('user', 'admin'), updateReview)
    .delete(restrictedTo('user', 'admin'), deleteReview);

export default router;
