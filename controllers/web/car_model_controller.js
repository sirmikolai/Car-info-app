var carModel = require("../../models/car_model"),
    carBrand = require("../../models/car_brand");

exports.getAllCarModelsForBrand = async (req, res, next) => {
    let carBrandId = req.params.carBrandId;
    await carBrand.findOne({ _id: carBrandId }).select({ _id: 1, logo_url: 1, name: 1 }).then(async (carBrandInfo) => {
        await carModel.find({ car_brand_id: carBrandId }).select({ __v: 0 }).then((carModelsInfo) => {
            res.locals.successMessage = req.session.successMessage;
            res.locals.errorMessage = req.session.errorMessage;
            req.session.successMessage = null;
            req.session.errorMessage = null;
            res.render("carmodels/index", { carBrand: carBrandInfo, carModels: carModelsInfo });
        }).catch((error) => {
            next(error);
        });
    }).catch((error) => {
        next(error);
    });
}

exports.getAddCarModelForm = async (req, res, next) => {
    let carBrandId = req.params.carBrandId;
    await carBrand.findOne({ _id: carBrandId }).select({ _id: 1, logo_url: 1, name: 1 }).then(async (carBrandInfo) => {
        res.locals.successMessage = req.session.successMessage;
        res.locals.errorMessage = req.session.errorMessage;
        req.session.successMessage = null;
        req.session.errorMessage = null;
        res.render('carmodels/add-car-model-form', { carBrand: carBrandInfo });
    }).catch((error) => {
        next(error);
    });
}

exports.addCarModel = async (req, res, next) => {
    let carBrandId = req.params.carBrandId;
    await carBrand.findOne({ _id: carBrandId }).then(async () => {
        let jsonObj = {
            name: req.body.name,
            car_brand_id: carBrandId,
            class: req.body.class,
            number_of_generations: req.body.number_of_generations
        }
        let document = new carModel(jsonObj);
        await document.save().then(() => {
            res.session.successMessage = "Car model has been added."
            res.redirect("/car-brand/" + carBrandId + "/car-models");
        });
    }).catch((error) => {
        next(error);
    });
}

exports.getEditCarModelForm = async (req, res, next) => {
    let id = req.params.id;
    let carBrandId = req.params.carBrandId;
    await carBrand.findOne({ _id: carBrandId }).select({ _id: 1, logo_url: 1, name: 1 }).then(async (carBrandInfo) => {
        await carModel.findOne({ _id: id, car_brand_id: carBrandId }).then((carModelInfo) => {
            res.locals.successMessage = req.session.successMessage;
            res.locals.errorMessage = req.session.errorMessage;
            req.session.successMessage = null;
            req.session.errorMessage = null;
            res.render("carmodels/edit-car-model-form", { carBrand: carBrandInfo, carModel: carModelInfo })
        }).catch((error) => {
            next(error);
        });
    }).catch((error) => {
        next(error);
    });
}

exports.updateCarModel = async (req, res, next) => {
    let id = req.params.id;
    let carBrandId = req.params.carBrandId;
    let jsonObj = {
        name: req.body.name,
        class: req.body.class,
        number_of_generations: req.body.number_of_generations
    }
    await carModel.findByIdAndUpdate(id, jsonObj).then(async () => {
        res.session.successMessage = "Car model has been updated."
        res.redirect("/car-brand/" + carBrandId + "/car-models");
    }).catch((error) => {
        next(error);
    });
}

exports.deletCarModel = async (req, res, next) => {
    let id = req.params.id;
    let carBrandId = req.params.carBrandId;
    await carModel.findOneAndRemove({ _id: id, car_brand_id: carBrandId }).then(() => {
        res.session.successMessage = "Car model has been removed."
        res.redirect("/car-brand/" + carBrandId + "/car-models");
    }).catch((error) => {
        next(error);
    });
}