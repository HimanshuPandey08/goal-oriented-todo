require("dotenv").config()
const app = require("./src/app")
const connectDB= require("./src/config/db")

const PORT = process.env.PORT || 3000 ;


connectDB();



app.listen(PORT,()=>{ console.log(`The server is running on ${PORT}`)})