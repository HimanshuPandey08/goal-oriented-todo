const mongoose = require("mongoose");



async function connectDB() {
    
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("The DB has been connected")
    } catch (err) {
        console.log(`DB connection has error,${err}`)
        process.exit(1);
    }
}

module.exports = connectDB