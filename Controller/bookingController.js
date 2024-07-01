import Stripe from "stripe";
import Booking from "../Model/bookingModel.js";
import Tour from "../Model/tourModel.js";
import catchAsync from "../Utils/CatchAsync.js";
import factoryHandler from "./handleFactory.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckOutSession = catchAsync(async (req, res, next) => {
    //1) get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) create the checkout session

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get("host")}/tours/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                    },
                    unit_amount: tour.price * 100,
                },
                quantity: 1,
            }
        ],
        mode: 'payment'
    });

    // 3) create session as response
    res.status(201).json({
        status: 'Success',
        session
    })
});


// CREATE BOOKING CHECKOUT

export const createBookingCheckout = catchAsync(async (req, res, next) => {
    // This is only TEMPORARY , because its UNSECURE: everyone can booking without paying
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next()

    await Booking.create({ tour, user, price })

    res.redirect(`${req.originalUrl.split('?')[0]}`)

})




export const getAllBookings = factoryHandler.getAll(Booking);

export const createBooking = factoryHandler.createOne(Booking);

export const getBooking = factoryHandler.getOne(Booking);

export const updateBooking = factoryHandler.updateOne(Booking);

export const deleteBooking = factoryHandler.deleteOne(Booking);
