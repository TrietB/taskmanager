const express = require('express')

const { getAllTasks, createTask, getTaskByName, getTaskOfUser, updateTask } = require('../controllers/task.controller')

const router = express.Router()


//get all tasks
router.get('/', getAllTasks)

//create task
router.post('/', createTask)

//get a single task by name
router.get('/:taskId', getTaskByName)

//get task of user
router.get('/:name', getTaskOfUser)

//edit a task by id
router.put('/:taskId', updateTask)


module.exports = router

