const UserModel = require('../models/UsersModel')
var jwt = require('jsonwebtoken');


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
        res.status(500).json({
            status: 'Failed',
            message: error.message
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
            return res.status(400).json({
                status: 'Failed',
                message: 'User not found'
            })
        }
        if(user.password !== reqBody.password){
            return res.status(400).json({
                status: 'Failed',
                message: 'Wrong password'
            })
        }
        else{

            let payload = {
                exp: Math.floor(Date.now()/1000) + (60 * 60), // Expire in  1 hour
                data: user['email'] 
            }
            let token = jwt.sign(payload,'123456789')


            res.status(200).json({
                status: 'Success',
                message: 'Login success', 
                data: user,
                token: token
            })
        }

    }
    catch(error){
        res.status(400).json({
            status: 'Failed',
            message: error.message
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
        res.status(200).json({status: 'Success',data: user})
    }
    catch(error){
        res.status(400).json({status: 'Failed',data: error})
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
        res.status(400).json({
            status:'Failed',
            message: error.message
        })
    }
}
//Profile Update End