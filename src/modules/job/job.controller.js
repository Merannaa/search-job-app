import Job from '../../../DB/models/job.models.js'
import Company from '../../../DB/models/company.model.js'
import App from '../../../DB/models/application.model.js'

import { ErrorHandlerClass } from "../../utils/error-class.utils.js"
import cloudinary from '../../utils/cloudinary.js'


//add job API
export const addJob = async(req,res,next)=>{
    // data from request 
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        company
        } = req.body 
        
        
    // check job
    const job = await Job.findOne({jobTitle})
    if(job) return next(new ErrorHandlerClass("job already exist",400))

    //create job
   const newJob= await Job.create( {jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        company,
        addedBy:req.authUser._id},
        
     )
    res.status(201).json({message:"job added successfully!",data:newJob})
}

//update job API
export const updateJob = async(req,res,next)=>{
    // data from params
    const {_id} = req.params 

    // data from request 
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills} = req.body 

    // check owner 
    const owner = await Job.findOne({addedBy:req.authUser._id})
    if(!owner) return next(new ErrorHandlerClass("you not able to update job",403))

    //check job
    const job = await Job.findById(_id)
    if(!job) return next(new ErrorHandlerClass("Job not found",404))

    // update job
    const jobData = await job.updateOne(
    {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills
    },
    {
        new:true
    })

    res.status(200).json({message:"job updated successfully", data:jobData})
}

//delete job API
export const deleteJob =async(req,res,next)=>{
    // data from params
    const {_id}=req.params 
 
    // check owner 
    const owner = await Job.findOne({addedBy:req.authUser._id})
    if(!owner) return next(new ErrorHandlerClass("you not able to delete job",403))

    // check job exist 
    const job =await Job.findById(_id)
    if(!job) return next(new ErrorHandlerClass("job not found",404))

    // delete job
    await  job.deleteOne()
    res.json({message:"job deleted"})
}


//Get all Jobs with their company’s information API
export const getAllJobs = async ( req, res, next ) =>{
    const jobs = await Job.find().populate('company')
    if ( !jobs ) return next( new ErrorHandlerClass( "there are no jobs",404 ) )
    res.json( { message:"Succes", data: { jobs } } )
}

// Get all Jobs for a specific company API
export const getJobsWithCompany = async (req, res, next) => {
        const { name } = req.query; 
        // Find the company by name
        const company = await Company.findOne( { companyName: name } );
        //check company
        if (!company) return next(new ErrorHandlerClass("Company not found",404));

        // Find all jobs related to the company
        const jobs = await Job.find({ company: company._id });
        if (!jobs) return next(new ErrorHandlerClass("There are no jobs for this company",404));

        res.status(200).json({ message:"Success", data:jobs});
    
}

// Get all Jobs that match the following filters API
export const getFilteredJobs = async (req, res, next) => {

        // data from query
        const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

        // object to take filteration 
        const filter = {};
        // Add filters to object
        if (workingTime) filter.workingTime = workingTime;
        if (jobLocation) filter.jobLocation = jobLocation;
        if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
        if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: 'i' }; 
        if ( technicalSkills ) filter.technicalSkills = { $in: technicalSkills.split( ',' ) }; 
        
        // jobs match  filter
    const jobs = await Job.find( filter );
    if(!jobs)  return next(new ErrorHandlerClass("  not found",404))
        res.status(200).json({ message:"Success", data:jobs});
}

// apply to job API
export const applyToJob = async ( req, res, next ) =>
{
    // take user from middleware
    const {_id} = req.authUser
    const { jobId } = req.body;

    // uplaod pdf  on cloud
    const {secure_url} = await cloudinary.uploader.upload(req.file?.path)

    // Create a new job application document
    const application = await App.create({
            jobId: jobId,
            userResume:secure_url,
            userId:_id
        });

        // response
    return res.status(200).json({message: 'Job application submitted successfully',data: application });
}