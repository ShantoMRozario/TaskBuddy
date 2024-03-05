

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstName: { type: String },
        lastName: { type: String },
        profilePic: { type: String },
        createdDate: { type: Date, default: Date.now}
    },
    {
        versionKey: false
    }
    
);

const UserModel =  mongoose.model('users',userSchema)
module.exports = UserModel 