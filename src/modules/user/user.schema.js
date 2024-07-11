import Joi from "joi";

export const SignupSchema={
    body:Joi.object({
    firstName:Joi.string().required().min(3).max(15),
    lastName:Joi.string().required().min(3).max(15),
    username:Joi.string().required().min(3).max(15),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    DOB:Joi.date().required(),
    recoveryEmail:Joi.string().required(),
    mobileNumber:Joi.string().required(),
    role:Joi.string().valid('User','Company_HR').required(),
    }).with('email','password')
}

export const signInSchema = {
    body: Joi.object({
      email: Joi.string().email().trim(),
      mobileNumber: Joi.string().trim(),
      password: Joi.string().required(),
    })
      .with('email', 'password')
      .with('mobileNumber', 'password'),
  }

export const updateUserSchema = {
    body: Joi.object({
      firstName: Joi.string().trim().min(3),
      lastName: Joi.string().trim().min(3),
      email: Joi.string().email().trim(),
      recoveryEmail: Joi
        .string()
        .email()
        .trim()
        .disallow(Joi.ref('email'))
        .messages({
          '*': 'recoveryEmail must be valid Email and not equal email field value',
        }),
      DOB: Joi.date(),
      mobileNumber: Joi.string().trim(),
    }),
  }

export const updatePasswordSchema = {
    body: Joi
      .object({
        oldPassword: Joi.string().trim().min(8).required(),
        newPassword: Joi
          .string()
          .trim()
          .disallow(Joi.ref('oldPassword'))
          .required()
          .messages({
            '*': 'new password should not be old password',
          }),
      })
      .with('newPassword', 'oldPassword'),
}

export const resetPasswordSchema  = Joi.object({
    email  :Joi.string().required() ,
    OTP  :Joi.string().required(),
    newPassword :Joi.string().required() ,
    confirmPassword  :Joi.string().required().valid(Joi.ref("newPassword")) 
})