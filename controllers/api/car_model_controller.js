var carModel = require("../../models/car_model"),
    carBrand = require("../../models/car_brand");

exports.getAllCarModelsForBrand = async (req, res, next) => {
    let carBrandId = req.params.carBrandId;
    await carModel.find({ car_brand_id: carBrandId }).select({ __v: 0 }).then((carModelsInfo) => {
        if (carModelsInfo != null) {
            res.status(200).send(carModelsInfo)
        } else {
            throw "There are not any car models for car brand id: " + carBrandId;
        }
    }).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when getting car models from DB",
        error
    }));
}

exports.getCarModelByIdForBrand = async (req, res, next) => {
    let id = req.params.id;
    let carBrandId = req.params.carBrandId;
    await carModel.findOne({ _id: id, car_brand_id: carBrandId }).select({ __v: 0 }).then((carModelInfo) => {
        if (carModelInfo != null) {
            res.status(200).send(carModelInfo)
        } else {
            throw "There are not any car models with id: " + id + " and for car brand id: " + carBrandId;
        }
    }).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when getting car model from DB",
        error
    }));
}

exports.addCarModelForBrand = async (req, res, next) => {
    let carBrandId = req.params.carBrandId;
    let jsonObj = req.body;
    await carBrand.findById(carBrandId).then(async () => {
        let data = {
            car_brand_id: carBrandId,
            name: jsonObj.name,
            class: jsonObj.class,
            number_of_generations: jsonObj.number_of_generations
        };
        let document = new carModel(data);
        await document.save().then((carModelInfo) => res.status(201).send(carModelInfo)).catch((error) => res.status(500).json({
            message: "Ooops! Something went wrong when adding car model to DB",
            error
        }));
    }).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when getting car brand from DB",
        error
    }));
};

exports.updateCarModelForBrand = async (req, res, next) => {
    let id = req.params.id;
    let carBrandId = req.params.carBrandId;
    let jsonObj = req.body;
    await carModel.findOneAndUpdate({ _id: id, car_brand_id: carBrandId }, {
        name: jsonObj.name,
        class: jsonObj.class,
        number_of_generations: jsonObj.number_of_generations
    }).then(async (carModelInfo) => {
        if (carModelInfo != null) {
            let data = await carModel.findById(id).select({__v: 0});
            if (data != null) {
                res.status(200).send(data)
            } else {
                throw "System encountered a problem with getting info about car model";
            }
        } else {
            throw "There are not any car models with id: " + id + " and for car brand id: " + carBrandId;
        }
    }).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when updating car model from DB",
        error
    }));
}

exports.deleteCarModelForBrand = async (req, res, next) => {
    let id = req.params.id;
    let carBrandId = req.params.carBrandId;
    await carModel.findOneAndRemove({ _id: id, car_brand_id: carBrandId }).then(() => res.sendStatus(204)).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when deleting car model from DB",
        error
    }));
}