import Company from '../../../DB/models/company.model.js'
import User from '../../../DB/models/user.model.js'
import App from '../../../DB/models/application.model.js'
import { ErrorHandlerClass } from "../../utils/error-class.utils.js"

//Add company API
export const addCompany = async(req,res,next)=>{
    // data  
    const {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail
        }= req.body
 
    // check  name of company
    const nameOfCompany = await Company.findOne({companyName})
    if(nameOfCompany) return next(new ErrorHandlerClass("Company exist before",409))
    // check email of company 
    const emailOfCompany = await Company.findOne({companyEmail})
    if(emailOfCompany) return next(new ErrorHandlerClass("company email already exist",409))


    // insert company
    const company = await Company.create({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail
        ,companyHR:req.authUser._id
    })
    // send response
    res.status(201).json({message :"Company Added Successfully",data:company})  
}

//Update company data API
export const updateCompany = async (req,res,next)=>{
    // company id from params
    const {_id}=req.params

    // data from request 
    const {companyName,
            description,
            industry,
            address,
            numberOfEmployees,
            companyEmail,
            }=req.body

    //check owner 
     const owner  = await Company.findOne({companyHR:req.authUser._id})
    if ( !owner ) return next( new ErrorHandlerClass( "you're not able to update company data", 403))

    // check company 
        const company = await Company.findById({_id})
        if(!company) return next(new ErrorHandlerClass("Company not found",404))

    // check company email exist
        const  emailExist = await Company.findOne({companyEmail})
        if(emailExist) return next(new ErrorHandlerClass("company email exist before",409))

    // check company name exist
        const  nameExist = await Company.findOne({companyName})
    if ( nameExist ) return next( new ErrorHandlerClass( "company name exist before", 409))

    const CompanyData =await company.updateOne(
    {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail
    },
    {
        new:true
    })
        res.status(200).json({message:"updated successfully",data:CompanyData})
}

//Delete company data API
export const deleteCompany = async(req,res,next)=>{
    // take id from params
    const {_id}=req.params

    // check owner 
    const owner = await Company.findOne({companyHR:req.authUser._id})
    if(!owner) return next(new ErrorHandlerClass("you not able to delete company",403))

    const company = await Company.findById(_id)
    if(!company) return next(new ErrorHandlerClass("company not found",404))

    // delete company
        await company.deleteOne()
        res.status(200).json({message:"company deleted"})

}
 

//Search for a company with a name API
export const searchCompany = async (req,res,next)=>{
    // data from request
    const {name} = req.params

    const company = await Company.findOne({companyName:name})
    if(!company) return next(new ErrorHandlerClass("company not found",404))

    res.status(200).json({message:"Success",data:{company}})
}

//Get company data API
export const getCompanyWithJobs = async ( req, res, next ) =>
    {
        // data
        const {_id} = req.params

        //check company with jobs
        const companyWithJobs = await Company.findById(_id).populate('jobs');
        if ( !companyWithJobs ) return next( new ErrorHandlerClass( "company not found", 404))

        res.status(200).json({message:"success",data:{companyWithJobs}})
}

// get all apps
export const getAppForJob = async (req, res, next) => {
    //data
    const _id = req.authUser

    const jobId = req.params.jobId;
    
    //check companyhr
    const owner = await Company.findOne(_id)
    if(!owner) return next(new ErrorHandlerClass("you not able to delete company",403))

    const applications = await App.find({ jobId: jobId, companyHR:_id}).populate({
                path: 'userId',
                model: 'User',
                select: '-password', 
            });
        res.status(200).json({message:"Success", data: applications });
}