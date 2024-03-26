const mongoose = require("mongoose")

const dbConnect  = () => {
    mongoose.connect(process.env.MONGODB_URL)
    console.log(`db connected`,process.env.MONGODB_URL);
}

module.exports = dbConnect