var carModel = require("../../models/car_model"),
    carBrand = require("../../models/car_brand");

exports.getAllCarBrands = async (req, res, next) => {
    await carBrand.find().select({ __v: 0 }).then((allCarBrands) => {
        res.locals.successMessage = req.session.successMessage;
        res.locals.errorMessage = req.session.errorMessage;
        req.session.successMessage = null;
        req.session.errorMessage = null;
        res.render('carbrands/index', { carBrands: allCarBrands });
    }).catch((error) => {
        next(error);
    });
}

exports.getAddCarBrandForm = async (req, res, next) => {
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;
    req.session.successMessage = null;
    req.session.errorMessage = null;
    res.render('carbrands/add-car-brand-form');
}

exports.addCarBrand = async (req, res, next) => {
    let jsonObj = {
        name: req.body.name,
        logo_url: req.body.logo_url,
        founded_year: req.body.founded_year,
        official_site: req.body.official_site,
        headquarter: {
            city: req.body.headquarter_city,
            country: req.body.headquarter_country,
        }
    }
    let document = new carBrand(jsonObj);
    await document.save().then(() => {
        req.session.successMessage = "Car brand has been added."
        res.redirect("/");
    }).catch((error) => {
        next(error);
    });
}

exports.getEditCarBrandForm = async (req, res, next) => {
    let id = req.params.id;
    await carBrand.findOne({ _id: id }).select({ __v: 0 }).then((carBrandInfo) => {
        res.locals.successMessage = req.session.successMessage;
        res.locals.errorMessage = req.session.errorMessage;
        req.session.successMessage = null;
        req.session.errorMessage = null;
        res.render('carbrands/edit-car-brand-form', { carBrand: carBrandInfo });
    }).catch((error) => {
        next(error);
    });
}

exports.updateCarBrand = async (req, res, next) => {
    let id = req.params.id;
    let jsonObj = {
        name: req.body.name,
        logo_url: req.body.logo_url,
        founded_year: req.body.founded_year,
        official_site: req.body.official_site,
        headquarter: {
            city: req.body.headquarter_city,
            country: req.body.headquarter_country,
        }
    }
    await carBrand.findByIdAndUpdate(id, jsonObj).then(async () => {
        req.session.successMessage = "Car brand has been updated."
        res.redirect("/");
    }).catch((error) => {
        next(error);
    });
}

exports.deleteCarBrandAndAllAssociatedCarModels = async (req, res, next) => {
    let id = req.params.id;
    await carModel.deleteMany({ car_brand_id: id }).then(async () => {
        await carBrand.findByIdAndRemove(id).then(() => {
            req.session.successMessage = "Car brand has been removed."
            res.redirect("/");
        }).catch((error) => {
            next(error);
        });
    }).catch((error) => {
        next(error);
    });
}