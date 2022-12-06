const express = require('express')

const { getAllTasks, createTask } = require('../controllers/task.controller')

const router = express.Router()


//get all tasks
router.get('/', getAllTasks)

//create task

router.post('/', createTask)


module.exports = router

