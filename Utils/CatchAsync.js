const catchAsync = (fun) => (req, res, next) => {
    fun(req, res, next).catch((error) => next(error));
};

export default catchAsync;
