//connect mongodb database 
import mongoose from "mongoose";

export const connection_db = async ()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/job-search-app")
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database",error);
    }
}