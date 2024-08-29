const mongoose = require("mongoose");

const schema = mongoose.Schema;

const PriceHistorySchema = new schema({

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
        date:{
            type: String,
            required:true
        },
    
    })

const PriceHistory =mongoose.model("PriceHistory",PriceHistorySchema);
module.exports = PriceHistory;