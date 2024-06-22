import express from 'express';

// eslint-disable-next-line import/named
import {
    signup,
    verifyOtp,
    resendOtp,
    login,
    logout,
    forgotPassword,
    resetPassword,
} from '../Controller/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/verifyOtp', verifyOtp);
router.post('/resendOtp', resendOtp);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

export default router;
