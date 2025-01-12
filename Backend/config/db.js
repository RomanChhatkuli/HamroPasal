import mongoose from "mongoose";

const connectDB = async () =>{
    await mongoose.connect(process.env.MONGODB_URI)
    .then(() =>{
        console.log("Connected to database sucessfully.")
    })
    .catch((e) =>{
        console.log("Error in db.js: ",e.message)
    })
}

export default connectDB;