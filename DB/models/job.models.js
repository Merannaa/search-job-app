import mongoose from "mongoose"

const {Schema, model} = mongoose;

const jobSchema = new Schema({
    jobTitle:{
        type: String,
        required: true
    },
    jobLocation:{
        type:String,
        required:true,
        enum:['onsite','remotely','hybrid']
    },
    workingTime:{
        type:String,
        required:true,
        enum:['part-time','full-time']
    },
    seniorityLevel:{
        type:String,
        required:true,
        enum:['Junior','Mid-Level','Senior','Team-Lead','CTO']
    },
    jobDescription:{
        type:String,
        required:true
    },
    technicalSkills:{
        type: [String],
        required: true
    },
    softSkills:{
        type: [String],
        required: true
    },
    addedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    company: {
        type:Schema.Types.ObjectId,
        ref: 'Company'
    }
},{
    timestamps:true
});

export default mongoose.models.Job || model("Job", jobSchema);