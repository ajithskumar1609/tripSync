import express from 'express'

import { protect } from '../Controller/authController.js'

import { createWishList, deleteWishList, getAllWishList, getWishList, updateWishList, addItemToWishList, removeItemFromWishList } from '../Controller/wishListController.js'

const router = express.Router();


router.get('/addToWishList/:tourId', protect, addItemToWishList);
router.delete('/removeItemFromWishList/:tourId', protect, removeItemFromWishList);


router.route('/').get(getAllWishList).post(createWishList)

router.route('/:id').get(getWishList).patch(updateWishList).delete(deleteWishList)


export default router;