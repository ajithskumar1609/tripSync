import WishList from '../Model/wishListModel.js';
import AppError from '../Utils/AppError.js';
import catchAsync from '../Utils/CatchAsync.js';

export const addToWishList = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { tourId } = req.params;

    const itemObj = {
        tour: tourId,
    };

    // find the user check wishlist
    let wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
        wishList = new WishList({ user: userId, items: [itemObj] });
    } else {
        const existingItem = wishList.items.findIndex(
            (item) => item.tour.toString() === tourId,
        );

        if (existingItem !== -1) {
            return next(new AppError('Your item already in wishList', 409));
        }

        wishList.items.push(itemObj);
    }

    await wishList.save();

    res.status(201).json({
        status: 'Success',
        data: {
            wishList: wishList,
        },
    });
});

export const getUserWishList = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    // check find the user wishlist

    const wishList = await WishList.findOne({ user: userId }).populate({
        path: 'items.tour',
        select: 'name price ratingsAverage ratingsQuantity',
    });

    if (!wishList) {
        return next(AppError('Your wishList is empty', 404));
    }

    if (wishList.items.length === 0) {
        return next(new AppError('Your wishList is empty', 404));
    }

    res.status(200).json({
        status: 'Success',
        results: wishList.items.length,
        data: {
            wishList: wishList,
        },
    });
});

export const removeItemFromWishList = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { tourId } = req.params;

    // check find the user wishlist
    const wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
        return next(new AppError('Your wishList is empty', 404));
    }

    wishList.items = wishList.items.filter(
        (item) => item.tour.toString() !== tourId,
    );

    await wishList.save();

    res.status(204).json({
        status: 'Success',
        data: {
            wishList: wishList,
        },
    });
});
