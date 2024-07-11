import {Router} from 'express';
import * as companyController from './company.controller.js'

import { errorHandle } from '../../Middlewares/error-handle.middleware.js';
import { validationMiddleware } from '../../Middlewares/validation.middleware.js';
import { auth, isAuthorized } from "../../Middlewares/auth.middleware.js";


import { 
    addCompanySchema,
    deleteCompanySchema,
    getCompanySchema,
    searchCompanySchema,
    updateCompanySchema
} from './company.schema.js';

const router =Router()

router.post('/add',
            validationMiddleware(addCompanySchema),auth(),
            isAuthorized(['Company_HR']),
            errorHandle(companyController.addCompany))

router.put('/update/:_id',
            validationMiddleware(updateCompanySchema),auth(),
            isAuthorized(['Company_HR']),
            errorHandle(companyController.updateCompany))

router.delete('/delete/:_id',
            validationMiddleware(deleteCompanySchema),auth(),
            isAuthorized(['Company_HR']),
            errorHandle(companyController.deleteCompany))


router.get('/search/:name',
            validationMiddleware(searchCompanySchema),auth(),
            isAuthorized(['Company_HR','User']),
            errorHandle(companyController.searchCompany))

router.get('/get-job/:_id',
            validationMiddleware(getCompanySchema),
            
            errorHandle(companyController.getCompanyWithJobs))

router.get('/app/:jobId',
        
        errorHandle(companyController.getAppForJob)
)


export default router;