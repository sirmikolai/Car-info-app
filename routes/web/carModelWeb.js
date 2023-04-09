var express = require('express'),
  router = express.Router(),
  carModelsController = require("../../controllers/web/car_model_controller"),
  authPassport = require("../../middlewares/authPassport");

router.get('/car-brand/:carBrandId/car-models', carModelsController.getAllCarModelsForBrand);

router.get('/car-brand/:carBrandId/car-models/add-form', authPassport.verifyCurrentUser, carModelsController.getAddCarModelForm);

router.post('/car-brand/:carBrandId/car-models/add', authPassport.verifyCurrentUser, carModelsController.addCarModel);

router.get('/car-brand/:carBrandId/car-models/edit-form/:id', authPassport.verifyCurrentUser, carModelsController.getEditCarModelForm);

router.post('/car-brand/:carBrandId/car-models/edit/:id', authPassport.verifyCurrentUser, carModelsController.updateCarModel);

router.get('/car-brand/:carBrandId/car-models/delete/:id', authPassport.verifyCurrentUser, carModelsController.deletCarModel);

module.exports = router;