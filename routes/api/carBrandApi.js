var express = require("express"),
    router = express.Router(),
    auth = require("../../middlewares/authJwt"),
    carBrandsController = require("../../controllers/api/car_brand_controller");

router.get("/", carBrandsController.getAllCarBrands);

router.get("/:id", carBrandsController.getCarBrandById);

router.post("/", auth.verifyToken, carBrandsController.addCarBrand); 

router.put("/:id", auth.verifyToken, carBrandsController.updateCarBrand);

router.delete("/:id", auth.verifyToken, carBrandsController.deleteCarBrand);

module.exports = router;
