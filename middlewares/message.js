getSuccessMessage = (req, res, next) => {
    res.locals.successMessage = null;
    next();
};

getErrorMessage = (req, res, next) => {
    res.locals.errorMessage = null;
    next();
};

const authPassport = {
    getSuccessMessage,
    getErrorMessage
};

module.exports = authPassport;
