
import mongoose from "mongoose"

const {Schema, model} = mongoose;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    recoveryEmail:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    },
    mobileNumber:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['User','Company_HR'],
        required:true
    },
    status:{
        type:String,
        enum:['online','offline'],
        default:'offline'
    },
    isConfirmed:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true, 
});

export default mongoose.models.User || model("User", userSchema);