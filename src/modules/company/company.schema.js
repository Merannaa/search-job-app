import Joi from "joi";

// Custom validation function to check if the string is a valid MongoDB ObjectId
const isValidObjectId = (value, helpers) => {
    if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

export const addCompanySchema = Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.array()
    .items(Joi.number())
    .required(),
    companyEmail: Joi.string().email().required()
});

export const updateCompanySchema = Joi.object({   
companyName: Joi.string().optional(),
description: Joi.string().optional(),
industry: Joi.string().optional(),
address: Joi.string().optional(),
numberOfEmployees: Joi.array()
    .items(Joi.number())
    .optional(),
companyEmail: Joi.string().email().optional(),
_id:Joi.string().custom(isValidObjectId, 'ObjectId').required()
});

export const deleteCompanySchema = Joi.object({   
_id:Joi.string().custom(isValidObjectId, 'ObjectId').required()
});

export const getCompanySchema = Joi.object({   
_id:Joi.string().custom(isValidObjectId, 'ObjectId').required()
});

export const searchCompanySchema = Joi.object({   
name:Joi.string().required()
});