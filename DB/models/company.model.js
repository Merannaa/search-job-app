import mongoose from "mongoose"

const {Schema, model} = mongoose;

const companySchema = new Schema({
    companyName:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    industry:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    numberOfEmployees:{
        type:String,
        required:true,
        enum:['1-10','11-20','21-50','51-100']
    },
    companyEmail:{
        type:String,
        required:true,
        unique:true
    },
    companyHR:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true    
    }
},{
    timestamps:true
});
companySchema.virtual('jobs', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'company',
});
export default mongoose.models.Company || model("Company", companySchema);