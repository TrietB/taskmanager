const express = require('express')

const { getAllTasks, createTask, getTaskByName, getTaskOfUser, updateTask } = require('../controllers/task.controller')

const router = express.Router()


/**
 * @route GET api/task
 * @description get All tasks
 * @access private, manager
 * @allowQueries: task id, name, createdAt, updateAt 
 */
router.get('/', getAllTasks)

/**
 * @route POST api/task
 * @description get All tasks
 * @access private, manager
 * @requiredBody: role, name, description, status, assignedBy
 */
router.post('/', createTask)

/**
 * @route GET api/task
 * @description get single task by Id
 * @access private, manager
 * @requiredBody: role, name, description, status, assignedBy
 */
router.get('/:taskId', getTaskByName)

/**
 * @route GET api/task
 * @description get task of a user by name
 * @access private, manager
 * @requiredParams: user "name"
 */
router.get('/:name', getTaskOfUser)

/**
 * @route GET api/task
 * @description get single task by Id
 * @access private, manager
 * @requiredParams: taskId
 */
router.put('/:taskId', updateTask)


module.exports = router

