import express from 'express';

import { protect } from '../Controller/authController.js';
import {
    getAllBookings,
    createBooking,
    getBooking,
    deleteBooking,
    updateBooking,
    getCheckOutSession
} from '../Controller/bookingController.js';

const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckOutSession)

router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
