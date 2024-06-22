import Booking from '../Model/bookingModel.js';
import factoryHandler from './handleFactory.js';

export const getAllBookings = factoryHandler.getAll(Booking);

export const createBooking = factoryHandler.createOne(Booking);

export const getBooking = factoryHandler.getOne(Booking);

export const updateBooking = factoryHandler.updateOne(Booking);

export const deleteBooking = factoryHandler.deleteOne(Booking);
