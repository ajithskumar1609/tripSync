import Review from '../Model/reviewModel.js';
import factoryHandler from './handleFactory.js';

export const getAllReviews = factoryHandler.getAll(Review);

export const createReview = factoryHandler.createOne(Review);

export const getReview = factoryHandler.getOne(Review);

export const updateReview = factoryHandler.updateOne(Review);

export const deleteReview = factoryHandler.deleteOne(Review);
