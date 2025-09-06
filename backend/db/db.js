import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB=async()=>{
    try {
        mongoose.connection.on('connected',()=>console.log('Database Connected')); //to check if db is connected ....'connected' is event
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;