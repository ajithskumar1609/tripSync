import WishList from "../Model/wishListModel.js";
import AppError from "../Utils/AppError.js";
import catchAsync from "../Utils/CatchAsync.js";
import factoryHandler from "./handleFactory.js";


export const addItemToWishList = catchAsync(async (req, res, next) => {

    // 1) get the user and tour 
    const tour = req.params.tourId;
    const user = req.user.id;

    if (!tour && !user) {
        return next(new AppError('Provide tour and user', 404))
    }

    // 2) check if user wishlist exist
    let wishList = await WishList.findOne({ user: user });

    if (!wishList) {
        // If the wishlist doesn't exist, create a new one
        wishList = new WishList({ user: user, items: [] })
    }

    // Check if the item is already in the wishlist
    if (wishList.items.includes(tour)) {
        return res.status(400).json({ status: 'fail', message: 'Item already in list' })
    }

    wishList.items.push(tour)
    await wishList.save();

    console.log(wishList)

    res.status(200).json({
        status: 'Success',
        data: {
            wishList: wishList
        }
    })

})


export const removeItemFromWishList = catchAsync(async (req, res, next) => {

    // 1) get the user and tour 
    const tour = req.params.tourId;
    const user = req.user.id;

    if (!tour && !user) {
        return next(new AppError('Provide tour and user', 404))
    }

    // 2) check if user wishlist exist
    const wishList = await WishList.findOne({ user: user });

    if (!wishList) {
        return next(new AppError('Wishlist not found', 404))
    }

    // Check if the item is in the wishlist
    if (!wishList.items.includes(tour)) {
        return next(new AppError('item not found in wishList', 400));
    }

    wishList.items = wishList.items.filter((item) => item.toString() !== tour.toString())

    await wishList.save();

    res.status(200).json({
        status: 'Success',
        data: {
            wishList: wishList
        }
    })


})



export const getAllWishList = factoryHandler.getAll(WishList);

export const createWishList = factoryHandler.createOne(WishList);

export const getWishList = factoryHandler.getOne(WishList);

export const updateWishList = factoryHandler.updateOne(WishList);

export const deleteWishList = factoryHandler.deleteOne(WishList);
