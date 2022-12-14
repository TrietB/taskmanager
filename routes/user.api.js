const express = require('express')
const { createUser, editUser, getAllUsers, getUser } = require('../controllers/user.controller')

const router = express.Router()


/**
 * @route POST api/users
 * @description Create a new user
 * @access private, manager
 * @requiredBody: name
 */
router.post('/', createUser)

/**
 * @route PUT api/users
 * @description Edit a user - assign task
 * @access private, manager
 * @requiredParams: user Id
 */
router.put('/:id', editUser)

/**
 * @route GET api/users
 * @description Get a list of users
 * @access private
 * @allowedQueries: name
 */
router.get('/', getAllUsers)

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get('/:id', getUser)


module.exports = router