

const TodoModel = require('../models/TodoModel')


//Create Todo
exports.CreateTodo = async(req,res)=>{
    try{
        const reqBody = req.body;
        reqBody.email = req.headers.email
        const todo = await TodoModel.create(reqBody)
        res.status(200).json({ status:'success', data: todo})
        
    }
    catch(error){
        res.status(400).json({ status:'failed', message: error.message})
    }
}

//Create Todo


//Update Todo
exports.UpdateTodoStatus = async(req,res)=>{
    try{
        let id = req.params.id
        let status = req.params.status
        let query = {_id: id}
        const todo =  await TodoModel.updateOne(query,{status:status})
        res.status(200).json({status:'success', data: todo})
    }
    catch(error){
        res.status(400).json({status:'Failed', data: error.message})
    }
}
//Update Todo


//Delete Todo
exports.DeleteTodo = async(req,res)=>{
    try{
        let id = req.params.id
        let query = {_id: id}
        const todo = await TodoModel.deleteOne(query)
        res.status(200).json({status:'success', data: todo })
    }
    catch(error){
        res.status(400).json({status: 'Failed', data: error.message})
    }
}
//Delete Todo

//Find todo list by Status
exports.TodoListByStatus = async(req,res)=>{
    try{
        let status = req.params.status
        let email = req.headers.email
        const result = await TodoModel.aggregate(
            [
                {$match:{status:status , email:email}},
                {$project:{_id:1, title:1, description:1, status:1,createdDate:{$dateToString:{format: '%d-%m-%Y',date: '$createdDate'}}}}
            ]
        )

        res.status(200).json({status: 'succss', data: result})
    }
    catch(error){
        res.status(400).json({status: 'failed', data: error})  
    }
}
//Find todo list by Status

// @ Todo count by status
exports.TodoCountByStatus = async(req,res)=>{
    try{
        let email = req.headers.email
        const result = await TodoModel.aggregate(
            [
                {$match:{email:email}},
                {$group:{_id:"$status",total:{$count:{}}}}
            ]
        )
        res.status(200).json({ status:'success', data: result})    
    }
    catch(error){
        res.status(400).json({ status:'failed', data: error})
    }
}
// @ Todo count by status