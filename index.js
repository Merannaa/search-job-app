import express from 'express'

import { connection_db } from './DB/connection.js';

import userRouter from './src/modules/user/user.routes.js'
import companyRouter from './src/modules/company/company.routes.js'
import jobRouter from './src/modules/job/job.routes.js'
import { globalResponse } from './src/Middlewares/error-handle.middleware.js';

import {config} from 'dotenv'
config()

const app = express()
app.use(express.json())

app.use('/user',userRouter)
app.use('/company',companyRouter)
app.use('/job',jobRouter)
// app.use('/app',applicationRouter)

app.use(globalResponse)

connection_db()

const port = 3000;

app.get('/',(req,res)=>res.json('Hello job search app!'))
app.listen(port,()=>console.log(`server running on ${port}`))