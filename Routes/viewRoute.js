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
} from '../Controller/viewController.js';

import { isLoggedIn, protect } from '../Controller/authController.js';

const router = express.Router();

// router.use(loading);

router.get('/', isLoggedIn, getOverView);
router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);
router.get('/verifyOtp', getVerifyOtpForm);
router.get('/forgotPassword', getForgotPasswordForm);
router.get('/resetPassword/:token', getResetPasswordForm);
router.get('/allTour', isLoggedIn, getAllTour);
router.get('/filteredTour', isLoggedIn, getFilteredTours);
router.get('/me', protect, getAccount);
router.get('/security', protect, getSecurityPrivacy);

export default router;
