//error handling middleware

import { ErrorHandlerClass } from "../utils/error-class.utils.js";

export const errorHandle =(API)=>{
    return(req,res,next)=>{
        API(req,res,next).catch((err)=>{
            console.log("Error in errorHandle middleware",err);
            const insightsData = {
                error:"unhandled error"
            }
           next(new ErrorHandlerClass("Internal Server Error",
            500,
            err.stack,
            "Error from errorhandle middleware",
            insightsData
        ))
        })
    }
}

export const globalResponse =(err,req,res,next)=>{
    if(err){
        res.status(err["statusCode"]).json({
            message:"Internal Server Error",
            error:err.message,
            stack:err.stack,
            errPosition:err.name,
            data:err.data
        })
    }
}