import express from 'express';

import {
    getAllBookings,
    createBooking,
    getBooking,
    deleteBooking,
    updateBooking,
} from '../Controller/bookingController.js';

const router = express.Router();

router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
