import express from 'express';
import {
    getAllCategory,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    resizeCategoryImage,
} from '../Controller/categoryController.js';

import { protect, restrictedTo } from '../Controller/authController.js';

const router = express.Router();

router
    .route('/')
    .get(getAllCategory)
    .post(
        protect,
        restrictedTo('admin'),
        uploadCategoryImage,
        resizeCategoryImage,
        createCategory,
    );

router.use(protect);

router
    .route('/:id')
    .get(getCategory)
    .patch(restrictedTo('admin'), updateCategory)
    .delete(restrictedTo('admin'), deleteCategory);

export default router;
