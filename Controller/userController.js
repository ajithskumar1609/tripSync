import multer from 'multer';
import sharp from 'sharp';

import User from '../Model/userModel.js';
import AppError from '../Utils/AppError.js';
import catchAsync from '../Utils/CatchAsync.js';
import factoryHandler from './handleFactory.js';

const filterObj = (obj, ...allowed) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowed.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

export const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
});

export const updateUserPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.fileName = `user-${req.user.id}-${Date.now()}.jpg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/user/${req.file.fileName}`);

    next();
});

export const updateMe = catchAsync(async (req, res, next) => {
    // check if password and confirmPassword not allowed

    if (req.body.password || req.body.confirmPassword) {
        return next(
            new AppError(
                'This route is not for password updates.Please use /updateMyPassword',
                400,
            ),
        );
    }

    const filterBody = filterObj(req.body, 'name', 'email');

    if (req.file) filterBody.photo = req.file.fileName;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'Success',
        data: updatedUser,
    });
});

export const deleteMe = catchAsync(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    res.status(204).json({
        status: 'Success',
        data: deletedUser,
    });
});
export const deactivateMe = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        isActive: false,
    });

    res.status(200).json({
        status: 'Success',
        data: updatedUser,
    });
});

export const getAllUsers = factoryHandler.getAll(User);

export const createUser = factoryHandler.createOne(User);

export const getUser = factoryHandler.getOne(User);

export const updateUser = factoryHandler.updateOne(User);

export const deleteUser = factoryHandler.deleteOne(User);

// export const getAllUsers = catchAsync(async (req, res, next) => {
//     const allUsersDetails = await User.find();

//     res.status(200).json({
//         status: 'Success',
//         result: allUsersDetails.length,
//         data: allUsersDetails,
//     });
// });

// export const createUser = catchAsync(async (req, res, next) => {
//     const newUser = await User.create(req.body);

//     res.status(201).json({
//         status: 'Success',
//         data: {
//             user: newUser,
//         },
//     });
// });

// export const getUser = catchAsync(async (req, res, next) => {
//     const userDetails = await User.findById(req.params.id);

//     res.status(200).json({
//         status: 'Success',
//         data: {
//             user: userDetails,
//         },
//     });
// });

// export const updateUser = catchAsync(async (req, res, next) => {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//     });

//     res.status(200).json({
//         status: 'Success',
//         data: {
//             user: updatedUser,
//         },
//     });
// });

// export const deleteUser = catchAsync(async (req, res, next) => {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//         status: 'Success',
//         data: deletedUser,
//     });
// });
