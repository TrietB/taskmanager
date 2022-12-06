const express = require('express')
const { createUser, editUser, getAllUsers, getUser } = require('../controllers/user.controller')

const router = express.Router()


//Create new user

router.post('/', createUser)

//Edit user
router.put('/:id', editUser)
//Get all user
router.get('/', getAllUsers)

router.get('/:name', getUser)
module.exports = router