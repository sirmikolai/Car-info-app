var express = require("express"),
    router = express.Router(),
    auth = require("../../middlewares/authJwt")
    carModelsController = require("../../controllers/api/car_model_controller"),

router.get("/:carBrandId/car-models", carModelsController.getAllCarModelsForBrand);

router.get("/:carBrandId/car-models/:id", carModelsController.getCarModelByIdForBrand);

router.post("/:carBrandId/car-models", auth.verifyToken, carModelsController.addCarModelForBrand);

router.put("/:carBrandId/car-models/:id", auth.verifyToken, carModelsController.updateCarModelForBrand);

router.delete("/:carBrandId/car-models/:id", auth.verifyToken, carModelsController.deleteCarModelForBrand);

module.exports = router;