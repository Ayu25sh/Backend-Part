const mongoose = require("mongoose"); // instance of mongoose
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then( () => {console.log("DB ka connection successful")})
    .catch( (err) => {
        console.log("db connection failed");
        console.error(err);
        process.exit(1);
    });
}