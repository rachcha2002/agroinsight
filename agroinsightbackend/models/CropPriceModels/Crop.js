const mongoose = require("mongoose");

const schema = mongoose.Schema;

const CropPriceSchema = new schema({

        Crop_name: {
            type: String,
            required: true
        },
        Price: {
            type: Number,
            required: true
        },
        Market:{
            type:String,
            required:true
        },
        image:{
            type: String,
            required:true
        },
    
    })

const Crop = mongoose.model("CropPrice",CropPriceSchema);
module.exports = Crop;