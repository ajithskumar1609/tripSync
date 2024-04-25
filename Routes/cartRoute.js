import express from 'express';

import {
    addToCart,
    getUserCart,
    removeItemFromCart,
} from '../Controller/cartController.js';
import { protect, restrictedTo } from '../Controller/authController.js';

const router = express.Router();

router.use(protect, restrictedTo('user'));

router.post('/addToCart/:tourId', addToCart);
router.get('/', getUserCart);
router.delete('/:tourId', removeItemFromCart);

export default router;
