import Category from '../Model/categoryModel.js';
import Tour from '../Model/tourModel.js';
// import factoryHandler from './handleFactory.js';
import ApiFeatures from '../Utils/ApiFeatures.js';
import catchAsync from '../Utils/CatchAsync.js';
import AppError from '../Utils/AppError.js';
import WishList from '../Model/wishListModel.js';


export const getOverView = catchAsync(async (req, res) => {
    const categories = await Category.find();
    // console.log(categories);
    const trendingDestinations = await Tour.find({ trendingDestination: true });
    res.status(200).render('overview', {
        title: 'Home page',
        categories,
        partials: true,
        trendingDestinations,
    });
});
export const getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Login in your account',
        partials: false,
    });
};

export const getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Signup in your account',
        partials: false,
    });
};

export const getVerifyOtpForm = (req, res) => {
    res.status(200).render('verifyOtp', {
        title: 'Verify Otp',
        email: req.session.email,
        partials: false,
    });
};

export const getForgotPasswordForm = (req, res) => {
    res.status(200).render('forgotPassword', {
        title: 'Forgot Password',
        partials: false,
    });
};
export const getResetPasswordForm = (req, res) => {
    const resetToken = req.params.token;
    res.status(200).render('resetPassword', {
        title: 'Reset Password',
        resetToken: resetToken,
        partials: false
    });
};

export const getAllTour = async (req, res) => {
    const tours = await Tour.find();
    res.status(200).render('view-all-tour', {
        title: 'All Tour',
        user: res.locals.user,
        partials: true,
        tours,
    });
};
export const getFilteredTours = async (req, res) => {
    // const tours = await Tour.find();

    const features = new ApiFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .pagination()
        .fields();
    // const docs = await features.query.explain();
    const tours = await features.query;

    res.status(200).render('tour-list', {
        partials: false,
        tours,
    });
};



export const getAccount = (req, res) => {
    res.status(200).render('account-settings', {
        title: 'You Account',
        partials: true,
    });
};

export const getSecurityPrivacy = (req, res) => {
    res.status(200).render('security-password', {
        title: 'privacy & security',
        partials: true,
    });
};

export const getCategories = catchAsync(async (req, res, next) => {
    //ALL CATEGORIES
    const categories = await Category.find();

    res.status(200).render('category', {
        title: 'All Categories',
        categories,
        partials: true,
    });
});
export const getTrendingDestination = catchAsync(async (req, res, next) => {
    //ALL CATEGORIES
    const trendingDestinations = await Tour.find({ trendingDestination: true });

    res.status(200).render('category', {
        title: 'Top Trending Destination',
        trendingDestinations,
        partials: true,
    });
});

// retrieve the tour
export const getTour = catchAsync(async (req, res, next) => {

    const tourName = req.params.slug;

    const tour = await Tour.findOne({ slug: tourName }).populate({
        path: 'reviews',
        fields: 'rating review user'
    });
    // console.log(tour);

    if (!tour) return next(new AppError('There is no tour with that name.', 404))

    res.status(200).render('tour', {
        title: `${tour.name}`,
        partials: true,
        tour,
    })

})

// WISH LIST 

export const getWishList = catchAsync(async (req, res, next) => {

    const userId = req.user.id;

    const wishList = await WishList.findOne({ user: userId }).populate('items');

    // console.log(wishList);

    if (!wishList) {
        return next(new AppError('Add to WishList', 400))
    }

    res.status(200).render('wishlist', {
        title: 'Your WishList',
        partials: true,
        tours: wishList.items
    })
})


// $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
