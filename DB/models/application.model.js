import mongoose from "mongoose"

const {Schema, model} = mongoose;

const applicationSchema = new Schema({
    jobId:{
        type:Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    userTechSkills:{
        type: [String],
        required: true
    },
    userSoftSkills:{
        type: [String],
        required: true
    },
    userResume:[{
        type: String, 
        required: true
    }]
},{
    timestamps:true
});

export default mongoose.models.App || model("App", applicationSchema);