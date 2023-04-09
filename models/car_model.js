var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId;

var carModelsSchema = new Schema({
    _id: { type: objectId, auto: true },
    car_brand_id: { type: objectId, required: true },
    name: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    number_of_generations: { type: Number, required: true}
});

var carModel = mongoose.model('CarModels', carModelsSchema);

module.exports = carModel;