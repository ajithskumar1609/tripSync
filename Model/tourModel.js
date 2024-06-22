import mongoose from 'mongoose';

import slugify from 'slugify';
// import User from './userModel.js';

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have name'],
            unique: true,
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have duration'],
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must have above 1.0'],
            max: [5, 'Rating must have below 5.0'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'difficult'],
        },
        price: {
            type: Number,
            required: [true, 'A tour must have price'],
        },
        summary: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
        },
        startLocation: {
            // Geo Json
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        secretTour: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        trendingDestination: {
            type: Boolean,
            default: false,
        },
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        images: [String],
        startDates: [
            {
                date: {
                    type: Date,
                },
                participant: {
                    type: Number,
                    default: 0,
                },
                maxParticipants: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        slug: String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// index - increase the read performance
tourSchema.index({ price: 1 }); // individual field

// compound index
tourSchema.index({ price: 1, ratingsAverage: -1 });

// virtual Property

tourSchema.virtual('durationWeek').get(function () {
    return this.duration / 7;
});

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

//todo: DOCUMENT MIDDLEWARE : run before on .save() .create()

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

//todo:  Query MIDDLEWARE

// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -createdAt -isActive',
    });
    next();
});

tourSchema.post(/^find/, function (doc, next) {
    console.log(`Query Executed ${Date.now() - this.start} Milliseconds`);
    // console.log(doc);
    next();
});

// tourSchema.pre('save', async function (next) {
//     const guidesPromise = this.guides.map(
//         async (id) => await User.findById(id),
//     );
//     this.guides = await Promise.all(guidesPromise);
//     next();
// });

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
