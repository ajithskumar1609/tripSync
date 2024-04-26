import mongoose from 'mongoose';

const wishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A true must have a user'],
    },
    items: [
        {
            tour: {
                type: mongoose.Schema.ObjectId,
                ref: 'Tour',
            },
        },
    ],
});

const WishList = mongoose.model('WISHLIST', wishListSchema);

export default WishList;
