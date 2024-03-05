

const express = require('express')
const router = express.Router()
const UsersController = require('../controller/UsersController')
const AuthVerifyMiddleware = require('../middleware/AuthVerifyMiddleware')
const TodoController = require('../controller/TodoController')


//Registration route
router.post('/registration', UsersController.Registration)

//Login route
router.get('/login',UsersController.Login)

//Update Profile route
router.post('/user-profile-update', AuthVerifyMiddleware ,UsersController.UpdateProfile)

// * Todo Api Routes 

//create 
 router.post('/create-todo', AuthVerifyMiddleware, TodoController.CreateTodo)
//update todo Status 
 router.get('/update-todo-status/:id/:status', AuthVerifyMiddleware, TodoController.UpdateTodoStatus)
//Delete todo Status 
 router.get('/delete-todo/:id', AuthVerifyMiddleware, TodoController.DeleteTodo)
// find todo by status
router.get('/find-by-status/:status',AuthVerifyMiddleware, TodoController.TodoListByStatus)
// count todo by status
router.get('/count-by-status',AuthVerifyMiddleware, TodoController.TodoCountByStatus)

module.exports = router
