var carModel = require("../../models/car_model"),
    carBrand = require("../../models/car_brand");

exports.getAllCarBrands = async (req, res, next) => {
    await carBrand.find().select({ __v: 0 }).then((allCarBrands) => {
        if (allCarBrands != null) {
            res.status(200).send(allCarBrands)
        } else {
            throw "There are not any car brands";
        }
    }).catch((error) => {
        res.status(500).json({
            message: "Ooops! Something went wrong when getting car brands from DB",
            error
        })
    })
}

exports.getCarBrandById = async (req, res, next) => {
    let id = req.params.id;
    await carBrand.findOne({ _id: id }).select({ __v: 0 }).then((carBrandInfo) => {
        if (carBrandInfo != null) {
            res.status(200).send(carBrandInfo)
        } else {
            throw "There are not any car brand with id: " + id;
        }
    }
    ).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when getting car brand from DB",
        error
    }));
}

exports.addCarBrand = async (req, res, next) => {
    let jsonObj = req.body;
    let document = new carBrand(jsonObj);
    await document.save().then((carBrandInfo) => res.status(201).send(carBrandInfo)).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when adding car brand to DB",
        error
    }));
}

exports.updateCarBrand = async (req, res, next) => {
    let id = req.params.id;
    let jsonObj = req.body;
    await carBrand.findByIdAndUpdate(id, {
        name: jsonObj.name,
        logo_url: jsonObj.logo_url,
        founded_year: jsonObj.founded_year,
        headquarter: {
            city: jsonObj.headquarter.city,
            country: jsonObj.headquarter.country
        },
        official_site: jsonObj.official_site
    }).then(async (carBrandInfo) => {
        if (carBrandInfo != null) {
            let data = await carBrand.findById(id).select({ __v: 0 });
            if (data != null) {
                res.status(200).send(data);
            } else {
                throw "System encountered a problem with getting info about car brand";
            }
        } else {
            throw "There are not any car brand with id: " + id;
        }
        
    }).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when updating car brand from DB",
        error
    }));
}

exports.deleteCarBrand = async (req, res, next) => {
    let id = req.params.id;
    await carModel.deleteMany({ car_brand_id: id }).then(async () => {
        await carBrand.findByIdAndDelete(id).then(() => res.sendStatus(204)).catch((error) => res.status(500).json({
            message: "Ooops! Something went wrong when deleting car brand from DB",
            error
        }));
    }).catch((error) => res.status(500).json({
        message: "Ooops! Something went wrong when deleting car models from DB",
        error
    }));
}