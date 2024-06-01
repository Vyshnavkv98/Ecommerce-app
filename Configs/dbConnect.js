const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        mongoose.set('strictQuery', false); 
         mongoose.connect(String(process.env.MONGODB_URL), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`db connected: ${process.env.MONGODB_URL}`);
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1); 
    }
};

module.exports = dbConnect;