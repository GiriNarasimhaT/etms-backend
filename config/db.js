const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to Databse : ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`error in conncection DB : ${error}`);
    }
}

module.exports = connectDB;