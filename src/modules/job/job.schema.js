import Joi from "joi";

const isValidObjectId = (value, helpers) => {
    if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}

export const addJopSchema =  Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().required(),
    workingTime: Joi.string().required(),
    seniorityLevel: Joi.string().required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array()
    .items(Joi.string()).required(),
    softSkills: Joi.array()
    .items(Joi.string()).required(),
    companyId:Joi.string().custom(isValidObjectId, 'ObjectId').required()
})


export const updateJobSchema = Joi.object( {   
    jobTitle: Joi.string().optional(),
    jobLocation: Joi.string().optional(),
    workingTime: Joi.string().optional(),
    seniorityLevel: Joi.string().optional(),
    jobDescription: Joi.string().optional(),
    technicalSkills: Joi.array()
        .items( Joi.string() ).optional(),
        softSkills: Joi.array()
    .items(Joi.string()).optional(),
    _id:Joi.string().custom(isValidObjectId, 'ObjectId').required(),
    companyId:Joi.string().custom(isValidObjectId, 'ObjectId').required()

})

export const deleteJobSchema= Joi.object({   
    _id:Joi.string().custom(isValidObjectId, 'ObjectId').required()
})