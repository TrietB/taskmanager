const mongoose = require('mongoose')
const { AppError, sendResponse } = require('../helpers/utils')
const User = require('../models/User')

const userController = {}


userController.createUser = async (req,res,next) => {
    const {name} = req.body

    try {
        if(!name) throw new AppError(401, "Missing required info", "Create user unsuccessful")
        const newUser = await new User({
            name: name
        })
        const created = await User.create(newUser)
        sendResponse(res,200,true,{user: created},null,{message: "User created successfully"})
    } catch (error) {
        next(error)
    }
}

userController.editUser = async (req,res,next) => {
    const {id} = req.params
    const updateInfo = req.body

    const options = {new:true}
    try {
        const updated = await User.findByIdAndUpdate(id,updateInfo,options)
        sendResponse(res,200,true,{data:updated},null,"User updated!")
    } catch (error) {
        next(error)
    }
}


userController.getAllUsers = async (req,res,next) => {
    // let {...filterQuery} = req.query
    try {
        // const allowedFilter = Object.keys(filterQuery)
        
        const user = await User.find({})

        sendResponse(res,200,true,{users: user}, null,{message:"Get list of User success"})
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = userController