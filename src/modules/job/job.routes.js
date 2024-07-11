import {Router} from 'express';
import * as jobController from './job.controller.js'

import { errorHandle } from '../../Middlewares/error-handle.middleware.js';
import { auth, isAuthorized } from '../../Middlewares/auth.middleware.js';
import { validationMiddleware } from '../../Middlewares/validation.middleware.js';
import { addJopSchema, deleteJobSchema, updateJobSchema } from './job.schema.js';
import { uploadFile } from '../../services/multerLocal.js';




const router =Router()

router.post('/add',
        validationMiddleware(addJopSchema),auth(),
        isAuthorized(['Company_HR']),
        errorHandle(jobController.addJob))

router.put('/update/:_id',
        validationMiddleware(updateJobSchema),auth(),
        isAuthorized(['Company_HR']),
        errorHandle(jobController.updateJob))

router.delete('/delete/:_id',
        validationMiddleware(deleteJobSchema),auth(),
        isAuthorized(['Company_HR']),
        errorHandle(jobController.deleteJob))

router.get('/',auth(),
        isAuthorized(['Company_HR','User']),
        errorHandle(jobController.getAllJobs))

router.get('/get-company',auth(),
        isAuthorized(['Company_HR','User']),
        errorHandle(jobController.getJobsWithCompany))

router.get('/get-filter',auth(),
        isAuthorized(['Company_HR','User']),
        errorHandle(jobController.getFilteredJobs))

router.get('/apply',auth(),
        isAuthorized(['User']),
        uploadFile().single("pdf"),
        errorHandle(jobController.applyToJob))

export default router;