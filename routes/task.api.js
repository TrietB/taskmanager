const express = require('express')

const { getAllTasks, createTask, getTaskByName, getTaskOfUser } = require('../controllers/task.controller')

const router = express.Router()


//get all tasks
router.get('/', getAllTasks)

//create task
router.post('/', createTask)

//get a single task by name
router.get('/:task', getTaskByName)

//get task of user
router.get('/:name', getTaskOfUser)


module.exports = router

