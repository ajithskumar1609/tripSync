import express from 'express';

import {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getMe,
    updateMe,
    deleteMe,
    updateUserPhoto,
    resizeUserPhoto,
    deactivateMe,
} from '../Controller/userController.js';

import {
    protect,
    restrictedTo,
    updateMyPassword,
} from '../Controller/authController.js';

const router = express.Router();

router.use(protect);

router.get('/me', protect, getMe, getUser);
router.patch('/updateMe', protect, updateUserPhoto, resizeUserPhoto, updateMe);
router.patch('/updateMyPassword', protect, updateMyPassword);
router.delete('/deleteMe', deleteMe);
router.patch('/deactivateMe', deactivateMe);

router.use(restrictedTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
