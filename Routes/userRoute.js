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
} from '../Controller/userController.js';

import {
    protect,
    restrictedTo,
    updateMyPassword,
} from '../Controller/authController.js';

const router = express.Router();

router.use(protect);

router.get('/me', protect, getMe, getUser);
router.patch('/updateMe', protect, updateMe);
router.patch('/updateMyPassword', protect, updateMyPassword);
router.patch('/deleteMe', protect, deleteMe);

router.use(restrictedTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
