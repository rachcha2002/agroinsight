const mongoose = require('mongoose');

const db = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)

        console.log('Connected to MongoDB');
        
    } catch (error) {
        console.log('Error: ', error.message);
    
    }
}


module.exports = db;