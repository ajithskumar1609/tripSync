import express from 'express';

import { protect, restrictedTo } from '../Controller/authController.js';
import {
    addToWishList,
    getUserWishList,
    removeItemFromWishList,
} from '../Controller/wishListController.js';

const router = express.Router();

router.use(protect, restrictedTo('user'));

router.post('/addToWishList/:tourId', addToWishList);
router.get('/', getUserWishList);
router.delete('/:tourId', removeItemFromWishList);
export default router;
