import bcryptjs from 'bcryptjs'
import crypto from "crypto"

import { User } from "../models/user.model.js"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeTemplate } from "../mailtrap/email.js"
// import { resolve } from 'path'

export const signup = async (req, res) => {
    const { email, password, name } = req.body
    try {
        if (!email || !password || !name) {
            throw new Error("All field are required")
        }

        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res.status(400).json({ sucess: false, message: "User already exist" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const VerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            VerificationToken,
            VerificationTokenExpiresAt: Date.now() + 24 * 60 * 60* 1000 // 24 hours
        })

        await user.save()

        // JWT 
        generateTokenAndSetCookie(res,user._id)

        await sendVerificationEmail(user.email, VerificationToken)

        res.status(201).json({
            sucess: true,
            message: "User created succesfully",
            user:{
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(400).json({ sucess: false, message: error.message })
        // res.status(400).json({ sucess: false, message: "Cannot send email" })
    }
}

export const verifyEmail = async (req, res)=>{
    // 1 2 3 4 5 6
    const {code} = req.body;
    try {
        const user = await User.findOne({
            VerificationToken: code,
            VerificationTokenExpiresAt: {$gt:Date.now()}
        })

        if(!user){
            return res.status(400).json({sucess:false, message:"Invalid or expired verification code"})
        }
        user.isVerified = true;
        user.VerificationToken = undefined;
        user.VerificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeTemplate(user.email, user.name)
        res.status(201).json({
            sucess:true,
            message: "Welcome email sent ",
            user:{
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        res.status(400).json({
            sucess: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    const { email, password} = req.body
    try {
       const user = await User.findOne({email}) 
       if(!user){
        return res.status(400).json({success: false, message: "User doesn't exist"})
       }
       const isPasswordValid = await bcryptjs.compare(password, user.password);

       if(!isPasswordValid){
        return res.status(400).json({success: false, message: "Invalid credentials."})
       }

       generateTokenAndSetCookie(res, user._id);

       user.lastLogin = new Date();
       await user.save()

       res.status(201).json({
        sucess: true,
        message: "Logged in succesfully",
        user:{
            ...user._doc,
            password: undefined
        }
    })

    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({success: false, message: error.message})
    }
}

export const forgotPassword = async (req, res) =>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email})

        if(!user){
            res.status(400).json({success: false, message: "User doesn't exist"})
        }
    
        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000; //1hour
    
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save()
    
        // Sending forgot password mail to user:
    
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({success: true, message: "Password reset link sent to your email"})
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
   
    
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({sucess: true, message: "Logged out successfully"})
}

export const resetPassword = async(req, res)=>{
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now()}
        })
        
        if(!user){
            res.status(400).json({success: false, message: "Invalid or expired token"})
        }

        // Update Password:

        const hashedPassword = await bcryptjs.hash(password, 10)

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success:true, message: "Password reset successfull"});
    } catch (error) {
        console.log("Error in reset password: ", error);
        res.status(400).json({success:false, message: error.message});
        
    }
}

export const checkAuth = async(req, res) =>{
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    try {
        const user = await User.findById(req.userId)
        if(!user){
            return res.status(400).json({success: false, message: "User not found"})
        }

        res.status(200).json({success: true, user:{
            ...user._doc,
            password: undefined
        }})
        
    } catch (error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({success: false, message: error.message})
        
    }
}

