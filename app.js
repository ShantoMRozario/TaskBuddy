

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose  = require("mongoose")
const rateLimit = require('express-rate-limit')
const multer = require('multer')
const bodyParser = require('body-parser')
const  route  = require('./src/routes/api')


//For limiting requests
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max:100 // limit each IP to 100 requests per windowMs
}))

//For cors
app.use(cors())

//For json
app.use(bodyParser.json())

//For Database start
const options = { user:'martin',pass:'martin123',dbName:'TaskBuddy' }
const uri = `mongodb+srv://${options.user}:${options.pass}@mycluster.wjniiuj.mongodb.net/${options.dbName}?retryWrites=true&w=majority`
mongoose.connect(uri,options)
.then(()=>{
    console.log('Database connected')
})
.catch((error)=>{
    console.log(error)
})
//For Database end

app.use('/api/v1',route)


app.use('*',(req,res)=>{
    res.status(404).json({
        message:'not found'
    })
})


module.exports = app 