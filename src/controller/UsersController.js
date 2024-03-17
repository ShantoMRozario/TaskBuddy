const OtpModel = require('../models/OtpModel');
const UserModel = require('../models/UsersModel')
var jwt = require('jsonwebtoken');
const SendEmailUtility = require('../utility/SendEmailUtility');


//Registration start
exports.Registration = async (req,res)=>{
    try{
        const reqBody = req.body
        const user = await UserModel.create(reqBody)
        res.status(200).json({
            status: 'Success',
            data: user
        })
    }
    catch(error){
        res.status(200).json({
            status: 'Failed',
            data: error
        })
    }
}
//Registration end

//Login start
exports.Login = async (req,res)=>{
    try{
        const reqBody = req.body
        let user = await UserModel.findOne({email: reqBody.email})
        if(!user){
            return res.status(200).json({
                status: 'Failed',
                data: 'User not found'
            })
        }
        if(user.password !== reqBody.password){
            return res.status(200).json({
                status: 'Failed',
                data: 'Wrong password'
            })
        }
        else{

            let payload = {
                exp: Math.floor(Date.now()/1000) + (60 * 60), // Expire in  1 hour
                data: user['email'] 
            }
            let token = jwt.sign(payload,'123456789')

            //Projection for not sending password
            const responsData = {email: user['email'],firstName: user['firstName'],lastName: user['lastName'],profilePic: user['profilePic']}

            res.status(200).json({status: 'Success',data: 'Login success',data: responsData ,token: token})
        }

    }
    catch(error){
        res.status(200).json({
            status: 'Failed',
            data: error.message
        })
    }
}
//Login end

//User Details Start
exports.ProfileDetails = async (req,res)=>{
    try{
        let email = req.headers.email
        let query = {email: email}
        const user = await UserModel.findOne(query)

        //Projection for not sending password 
        const responsData = {email: user['email'],firstName: user['firstName'],lastName: user['lastName'],profilePic: user['profilePic']}

        res.status(200).json({status: 'Success',data: responsData})
    }
    catch(error){
        res.status(200).json({status: 'Failed',data: error})
    }
}
//User Details End

//Profile Update Start
exports.UpdateProfile = async (req,res)=>{

    try{
        let email = req.headers.email
        let reqBody = req.body
        let query = {email: email}
        const user = await UserModel.updateOne(query,reqBody)
        res.status(200).json({
            status: 'Success',
            data: user
        }) 
    }
    catch(error){
        res.status(200).json({
            status:'Failed',
            data: error
        })
    }
}
//Profile Update End

//Email Verification Start
exports.EmailVerification = async (req,res)=>{
    try{
        let email = req.params.email
        let query = {email: email}

        //  Generate 5 Digit OTP (random number)
        let otp = Math.floor(10000 + Math.random() * 90000)

        const user = await UserModel.findOne(query)

        if(!user){
            return res.status(200).json({status:'Failed',data: 'User not found'})
        }
        else{
            //step 1 : create OTP
            let createOtp = await OtpModel.create({email:email, otp:otp})

            //Email template
            const EmailHTML = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>OTP Verification</title>
                    </head>
                    <body>
                        <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#265073">
                            <tr>
                                <td>
                                    <table align="center" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
                                        <tr>
                                            <td align="center" style="padding: 0px;">
                                                <img src="https://i.ibb.co/nPQtFTJ/Task-Buddy.png" alt="Company Logo" style="max-width: 200px;">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding: 20px 30px; background-color: #007bff;">
                                                <h1 style="color: #ffffff; font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; margin: 0;">OTP Verification</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" style="padding: 20px 30px;">
                                                <p style="color: #333333; font-family: Arial, sans-serif; font-size: 18px; line-height: 24px; margin: 0;">Dear User,</p>
                                                <p style="color: #333333; font-family: Arial, sans-serif; font-size: 18px; line-height: 24px; margin: 20px 0;">Thank you for choosing our service!</p>
                                                <p style="color: #333333; font-family: Arial, sans-serif; font-size: 18px; line-height: 24px; margin: 0;">Your OTP for verification is: <strong style="color: #007bff;">${otp}</strong></p>
                                                <p style="color: #333333; font-family: Arial, sans-serif; font-size: 18px; line-height: 24px; margin: 20px 0;">Please enter this OTP in the verification page to complete the process.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#007bff" style="padding: 30px; text-align: center;">
                                                <p style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; line-height: 18px; margin: 0;">For any assistance, please contact our support team at <a href="mailto:support@example.com" style="color: #ffffff; text-decoration: none;">support@example.com</a></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>


            `

            //step 2 : Send Email
            let sendEmail = SendEmailUtility(email,'TaskBuddy Email Verification', EmailHTML )
            res.status(200).json({status:'Success',data:sendEmail})
        }

    }
    catch(error){
        res.status(200).json({status:'Failed', data: error})
    } 
}  
//Email Verification End

//Otp Verification Start
exports.OtpVerification = async(req,res)=>{
    try{
        let email = req.params.email
        let otp = req.params.otp
        let status = 0
        let updateStatus = 1
        let otpCheck = await OtpModel.aggregate([
            {$match:{email:email, otp:otp}},
            {$count:'total'}
        ])

        if(otpCheck.length > 0){
            let updateOtp = await OtpModel.updateOne({email: email, otp: otp},{email: email, otp: otp, status: updateStatus})
            res.status(200).json({status:'Success',data: 'OTP Verified Successfully'})
        }
        else{
            res.status(200).json({status:'Failed', data: 'Invalid OTP'})
        }
    }
    catch(error){
        res.status(200).json({status:'Failed', data: error})
    }
}
//Otp Verification End

//Reset Password Start
exports.ResetPassword = async(req,res)=>{
    try{
        let email = req.body.email
        let otp = req.body.otp
        let updatePassword = req.body.password
        let updateStatus = 1

        let otpCheck = await OtpModel.aggregate([
            {$match:{email:email, otp:otp, status:updateStatus}},
            {$count:'total'}
        ])

        if(otpCheck.length > 0 ){
            let passwordUpdate = await UserModel.updateOne({email:email},{password:updatePassword})
            res.status(200).json({status:'Success',data: passwordUpdate, message:'Password Updated Successfully'})
        }
        else{
            res.status(200).json({status:'Failed', data: 'Invalid OTP'})
        }
    }
    catch(error){
        res.status(200).json({status:'Failed', data: error.message})
    }
}
//Reset Password End