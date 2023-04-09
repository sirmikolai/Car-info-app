var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId;

var carBrandsSchema = new Schema({
    _id: { type: objectId, auto: true },
    name: { type: String, required: true, unique: true },
    logo_url: { type: String, required: false },
    founded_year: { type: Number, required: true },
    headquarter: {
        city: { type: String, required: false },
        country: { type: String, required: true }
    },
    official_site: { type: String, required: false, unique: true }

});

var carBrand = mongoose.model('CarBrands', carBrandsSchema);

module.exports = carBrand;