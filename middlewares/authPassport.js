var user;

getCurrentUser = (req, res, next) => {
    user = req.user;
    res.locals.currentUser = req.user;
    next();
};

verifyCurrentUser = (req, res, next) => {
    if (user) {
        next();
    } else {
        req.session.errorMessage = "You need to sign in to perform this action.";
        var prevUrl = req.header('Referer') || '/';
        res.redirect(prevUrl);
    }
};

isAdmin = async (req, res, next) => {
    if (user.role == "ADMIN") {
        next();
    } else {
        req.session.errorMessage = "You need ADMIN role to perform this action.";
        var prevUrl = req.header('Referer') || '/';
        res.redirect(prevUrl);
    }
};

const authPassport = {
    isAdmin,
    verifyCurrentUser,
    getCurrentUser
};

module.exports = authPassport;
