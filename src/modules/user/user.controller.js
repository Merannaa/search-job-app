import { compareSync, hashSync } from "bcrypt"
import jwt from "jsonwebtoken"

import User from "../../../DB/models/user.model.js"

import { ErrorHandlerClass } from "../../utils/error-class.utils.js"
import { generateOTP } from "../../utils/generate-otp.js"

import { sendEmailService } from "../../services/send-email.service.js"



//signup API
export const signup = async(req,res,next)=>{
    //data
const {
    firstName,
    lastName,
    username,
    email,
    password,
    DOB,
    recoveryEmail,
    mobileNumber,
    role,
    status
    }= req.body

    //check email exist or not
    const isEmailExist = await User.findOne({email})
    if(isEmailExist){
        next(new ErrorHandlerClass("Email is already exist",
            409,
            req.body,
            "Error from check email",
        {email}))
    }

    //check mobileNumber exist or not
    const isPhoneExist = await User.findOne({mobileNumber})
    if(isPhoneExist){
        next(new ErrorHandlerClass("mobileNumber is already exist",
            409,
            req.body,
            "Error from check mobileNumber",
        {mobileNumber}))
    }

    //hash password
    const hashedPassword = hashSync(password,12)

    //prepare user object
    const user = new User({
        firstName,
        lastName,
        username,
        email,
        password:hashedPassword,
        DOB,
        recoveryEmail,
        mobileNumber,
        role,
        status
    });

    //generate token for _id to secure
    const token =jwt.sign(
        {_id:user._id},
        "confirmationToken",
        {expiresIn:"24h"}
    )

    //generate email confirmation link
    const confirmationLink =`${req.protocol}://${req.headers.host}/user/verify-email/${token}`

    //sending mail
    const isEmailSent = await sendEmailService({
        to:email,
        subject:"Activate your job-search-app account ❤️ verify your email",
        textMessage:"Thank you for signing up . Click  to verify your email",
        htmlMessage:`<h3> Thank you for signing up.
        <a href="${confirmationLink}">
        Click here to verify your email 🙃🏴‍☠️</a>
        </h3>`
    });

    if(isEmailSent){
        return res.status(500).json({message:"verification email failed"})
    }

    //create new user object
    const newUser = await user.save()

    res.status(201).json({message:"User Creadted Successfully", data:newUser})
}

//verify Email 
export const verifyEmail = async(req,res)=>{

    const {token} = req.params

    const data = jwt.verify(token, "confirmationToken")

    const confirmedUser = await User.findOneAndUpdate(
        {_id: data?.userId},
        {isConfirmed:true},
        {new:true}
    );
    if(!confirmedUser){
        return res.status(404).json({message:"User Not Found"})
    }

    res.status(200).json({message:"User Verified Successfully", confirmedUser})
}

//signin API
export const  signin = async(req,res,next)=>{
    //data
    const{email,mobileNumber,password}=req.body

    //check user email
    const user = await User.findOne({$or:[{email},{mobileNumber}]})
    if(!user){
        next( new ErrorHandlerClass("Invalid login credentails",
            404,
            "invalid login Stack",
            "Error from signin controller"
        ))
    }

    //match password
    const isMatch = compareSync(password, user.password)
    if(!isMatch){
        next( new ErrorHandlerClass("Invalid login credentails",
            404,
            "invalid login Stack",
            "Error from signin match password"
        ))
    }

    //generate token
    const token = jwt.sign(
        {
        _id:user._id,
        email:user.email,
        role: user.role
        },
    "accessTokenSignature",
    {expiresIn:"24h"}
)
//update status
    user.status='online';
    await user.save();

    res.status(200).json({message:"User Logged in Successfully", token})
}

//update account API
export const updateAccount =async(req,res,next)=>{
//data
    const {
    firstName,
    lastName,
    email,
    DOB,
    recoveryEmail,
    mobileNumber,
    } = req.body
    
    const{_id}=req.authUser
   
    const user= await User.findByIdAndUpdate(_id,
        {
            firstName,
            lastName,
            email,
            DOB,
            recoveryEmail,
            mobileNumber,
           
        },
        {
            new:true
        }
    )
    
    if(!user){
        res.status(400).json({message:"User Not Found"})
    }

 user.__v++
  const updateUser = await user.save()
    res.status(200).json({message:"User updated successfully",data:updateUser})

}

//delete account API
export const deleteAccount =async(req,res,next)=>{  
     
       const{_id}=req.authUser
        const user= await User.findByIdAndDelete(_id)
        
        if(!user){
            res.status(400).json({message:"User Not Found"})
        }

        res.status(200).json({message:"User deleted successfully"})
}

//get account API
export const getProfile=async(req,res)=>{
    const{_id}=req.authUser

    const user= await User.findById(_id)
    
    if(!user){
        res.status(400).json({message:"User Not Found"})
    }

    res.status(200).json({message:"User fetched successfully",data:user})
}

//get another account API
export const getPublicAccount=async(req,res,next)=>{

    const {_id}=req.params
    const publicUser= await User.findById(_id).select("-password")
    
    if(!publicUser){
        return next(new ErrorHandlerClass("User Not Found",
            404
        ))
    }

    res.status(200).json({message:"User fetched successfully",data:{publicUser}})
}

//Update password API
export const updatePassword =async(req,res,next)=>{
    const {_id}=req.authUser
    const {oldPassword,newPassword}=req.body

    const isUserExist = await User.findById(_id)
    if(!isUserExist){
        return next(new ErrorHandlerClass("User Not Found",404))
    }
    //check password in db = oldpassword
    const isOldPasswordMatchUserPassword = compareSync(
        oldPassword,
        isUserExist.password
      )
      if (!isOldPasswordMatchUserPassword) {
        return next(
          new ErrorHandlerClass("Old password isn't match the user password", 401)
        )
      }
      //hash new password
      const hashingNewPassword = hashSync(newPassword,12)
      // update password
      isUserExist.password = hashingNewPassword
      await isUserExist.save()

      res.status(200).json({message:"Password changed successfully"})
}

// forget password
export const forgetPassword = async (req,res)=>{
   
        // data from request
        const {email} = req.body
        //check user
        const user = await User.findOne({email})
        if(!user) return next(new ErrorHandlerClass("User not Found!",404))
        // generate OTP
        const otp = generateOTP();
    
        user.OTP= otp
        await user.save()
        // send response
        res.status(200).json({message:"there is your OTP don't share it",data:otp})
}



// accounts-by-recovery-email
export const getAccountsByRecoveryEmail = async (req, res) => {
    const { recoveryEmail } = req.authUser;
    const users = await User.find({ recoveryEmail });
    res.status(200).json({message:"Email fetched successfully",data:users})
}



