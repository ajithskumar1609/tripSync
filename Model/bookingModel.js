import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A tour must have been booking in tour details'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A tour must have user name'],
    },
    price: {
        type: Number,
        required: [true, 'A tour must have price'],
    },
    paid: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

bookingSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name',
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
