const catchAsync = (fun) => (req, res, next) => {
    return fun(req, res, next).catch((error) => next(error));
};

export default catchAsync;
