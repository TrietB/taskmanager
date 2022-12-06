const express = require('express')

const { getAllTasks, createTask, getTaskByName } = require('../controllers/task.controller')

const router = express.Router()


//get all tasks
router.get('/', getAllTasks)

//create task

router.post('/', createTask)

//get task by name
router.get('/:task', getTaskByName)


module.exports = router

