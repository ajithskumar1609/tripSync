import express from 'express';

import {
    getOverView,
    getLoginForm,
    getSignupForm,
    getVerifyOtpForm,
    getForgotPasswordForm,
    getResetPasswordForm,
    getAllTour,
    getAccount,
    getSecurityPrivacy,
    getFilteredTours,
    getTour,
    getWishList
} from '../Controller/viewController.js';

import { isLoggedIn, protect } from '../Controller/authController.js';
import { createBookingCheckout } from '../Controller/bookingController.js';

const router = express.Router();

// router.use(loading);

router.get('/', createBookingCheckout, isLoggedIn, getOverView);
router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);
router.get('/verifyOtp', getVerifyOtpForm);
router.get('/forgotPassword', getForgotPasswordForm);
router.get('/resetPassword/:token', getResetPasswordForm);
router.get('/tours', isLoggedIn, getAllTour);
router.get('/filteredTour', isLoggedIn, getFilteredTours);
router.get('/me', protect, getAccount);
router.get('/security', protect, getSecurityPrivacy);
router.get('/tours/:slug', isLoggedIn, getTour)
router.get('/wishlist', protect, getWishList);
export default router;
