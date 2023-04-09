var express = require('express'),
  router = express.Router(),
  carBrandsController = require("../../controllers/web/car_brand_controller"),
  authPassport = require("../../middlewares/authPassport");

router.get('/', carBrandsController.getAllCarBrands);

router.get('/car-brand/add-form', authPassport.verifyCurrentUser, carBrandsController.getAddCarBrandForm);

router.post('/car-brand/add', authPassport.verifyCurrentUser, carBrandsController.addCarBrand);

router.get('/car-brand/edit-form/:id', authPassport.verifyCurrentUser, carBrandsController.getEditCarBrandForm);

router.post('/car-brand/edit/:id', authPassport.verifyCurrentUser, carBrandsController.updateCarBrand);

router.get('/car-brand/delete/:id', authPassport.verifyCurrentUser, carBrandsController.deleteCarBrandAndAllAssociatedCarModels);

module.exports = router;