import Cart from '../Model/cartModel.js';
import AppError from '../Utils/AppError.js';

import catchAsync from '../Utils/CatchAsync.js';

export const addToCart = catchAsync(async (req, res, next) => {
    if (!req.params.userId) req.params.userId = req.user.id;

    const { userId, tourId } = req.params;

    const itemObj = {
        tour: tourId,
    };

    // find the user cart

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [itemObj] });
    } else {
        const existingItem = cart.items.findIndex(
            (item) => item.tour.toString() === tourId,
        );

        if (existingItem !== -1) {
            return next(new AppError('This Item already in cart', 409));
        }

        cart.items.push(itemObj);
    }

    await cart.save();

    // Recalculate total price and save

    res.status(201).json({
        status: 'Success',
        data: {
            cart,
        },
    });
});

export const getUserCart = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    // find the user Cart

    const cart = await Cart.findOne({ user: userId }).populate({
        path: 'items.tour',
        select: 'name price maxGroupSize imageCover',
    });

    if (!cart) {
        return next(new AppError('Your Cart is Empty', 404));
    }

    // calculate total price

    const totalPrice = cart.items.reduce((total, item) => {
        // calculate each item price and quanity
        const subTotal = item.tour.price * item.quantity;
        // add total and subTota
        return total + subTotal;
    }, 0);

    cart.totalPrice = totalPrice;
    await cart.save();
    if (cart.totalPrice === 0) {
        return next(new AppError('Your cart is empty', 404));
    }

    res.status(200).json({
        status: 'Success',
        results: cart.items.length,
        data: {
            cart: cart,
        },
    });
});

export const removeItemFromCart = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { tourId } = req.params;

    // find the user cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return next(new AppError('Cart is Empty', 404));
    }

    cart.items = cart.items.filter((item) => item.tour.toString() !== tourId);

    await cart.save();

    res.status(204).json({
        status: 'Success',
        data: cart,
    });
});
