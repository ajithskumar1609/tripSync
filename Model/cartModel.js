import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A cart Must have a user'],
    },
    items: [
        {
            tour: {
                type: mongoose.Schema.ObjectId,
                ref: 'Tour',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    totalPrice: {
        type: Number,
        default: 0,
    },
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
