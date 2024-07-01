import mongoose from 'mongoose'

const wishListSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'User must been a wishList'
    },
    items: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: 'A wishlist must been tour'
        }
    ],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const WishList = mongoose.model('WishList', wishListSchema);

export default WishList;