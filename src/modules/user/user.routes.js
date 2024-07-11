import {Router} from 'express';
import * as userController from './user.controller.js'

import { errorHandle } from '../../Middlewares/error-handle.middleware.js';
import { auth } from '../../Middlewares/auth.middleware.js';
import { validationMiddleware } from '../../Middlewares/validation.middleware.js';

import { resetPasswordSchema, 
    signInSchema, SignupSchema, 
    updatePasswordSchema, 
    updateUserSchema } from './user.schema.js';

const router =Router()

router.post('/register',validationMiddleware(SignupSchema),errorHandle(userController.signup))
router.get('/verify-email/:token',errorHandle(userController.verifyEmail))
router.post('/login',validationMiddleware(signInSchema),errorHandle(userController.signin))
router.put('/update',auth(),validationMiddleware(updateUserSchema),errorHandle(userController.updateAccount))
router.delete('/delete',auth(),errorHandle(userController.deleteAccount))
router.get('/profile',errorHandle(userController.getProfile))
router.get('/profile/:_id',errorHandle(userController.getPublicAccount))
router.put('/update-password',validationMiddleware(updatePasswordSchema),auth(),errorHandle(userController.updatePassword))
router.post('/forget-password',auth(),errorHandle(userController.forgetPassword))
router.get('/recover-email',auth(),errorHandle(userController.getAccountsByRecoveryEmail))


export default router;