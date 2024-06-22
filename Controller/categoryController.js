import multer from 'multer';
import sharp from 'sharp';

import Category from '../Model/categoryModel.js';
import factoryHandler from './handleFactory.js';
import catchAsync from '../Utils/CatchAsync.js';

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
});

export const uploadCategoryImage = upload.single('imageURL');

export const resizeCategoryImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.fileName = `category-${req.user.id}-${Date.now()}.jpg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/category/${req.file.fileName}`);

    next();
});

export const getAllCategory = factoryHandler.getAll(Category);

export const createCategory = factoryHandler.createOne(Category);

export const getCategory = factoryHandler.getOne(Category);

export const updateCategory = factoryHandler.updateOne(Category);

export const deleteCategory = factoryHandler.deleteOne(Category);
