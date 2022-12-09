const mongoose = require('mongoose')
const { AppError, sendResponse } = require('../helpers/utils')
const Task = require('../models/Task')
const User = require('../models/User')

const userController = {}

//check for missing, or already exist, check role
userController.createUser = async (req,res,next) => {
    const {name, role, isAuthorized} = req.body

   
    
    try {
        if(!name) throw new AppError(401, "Missing required info", "Create user unsuccessful")
        if(!isAuthorized) throw new AppError(404,"Dont have access to create user","Create user unsuccessful" )
        if(!role) throw new AppError(404,'Role must be asigned', "Create user unsuccessful")

        let user = null
        switch ( role) {
            case 'manager':
                user = await User.findOne({name})
                if(user) throw new AppError(401, "User exist", "Create user unsuccessful")
                user = await new User({
                    name: name,
                    role: role
                })
                user.save()
                sendResponse(res,200,true,{user},null,{message: "User created successfully"})
                break;
            case 'employee':
                user = await User.findOne({name})
                if(user) throw new AppError(401, "User exist", "Create user unsuccessful")
                user = await new User({
                    name: name,
                })
                user.save()
                sendResponse(res,200,true,{user},null,{message: "User created successfully"})
                break
            default:
                return user
        }

        // let user = await User.findOne({name})
        // if(user) throw new AppError(401, "User exist", "Create user unsuccessful")
        // user = await new User({
        //     name: name,
        // })
        // user.save()
        // // const created = await User.create({name})
        // sendResponse(res,200,true,{user},null,{message: "User created successfully"})
    } catch (error) {
        next(error)
    }
}


//check user exist, update info, check role
userController.editUser = async (req,res,next) => {
    const {id} = req.params
    const {isAuthorized, name, role} = req.body
    
    const updateInfo = {
        name,
        role
    }
    const options = {new:true}
    try {
        if(!isAuthorized) throw new AppError(400,"Not authorized", "Update user unsucessful")
        let user = await User.findById(id)
        if (!user) throw new AppError(404,"User not found", "Update user unsuccess") 
        const updated = await User.findByIdAndUpdate(id,updateInfo,options)
        sendResponse(res,200,true,{data:updated},null,"User updated!")
    } catch (error) {
        next(error)
    }
}

//
userController.getAllUsers = async (req,res,next) => {
    let {role} = req.query

    try {
        if(!role){
            let user = await User.find({})
            sendResponse(res,200,true,{users: user}, null,{message:"Get list of User success"})
        }else {
            let user = await User.find({role})
            sendResponse(res,200,true,{users: user}, null,{message:"Get list of User success"})

        }

        // let user = await User.find({})
        // sendResponse(res,200,true,{users: user}, null,{message:"Get list of User success"})
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//check exist user
userController.getUser = async (req,res,next) => {
    
    let {name} = req.params
    console.log(name)
    try {
        const user = await User.findOne({name: name})

        sendResponse(res,200,true,{user: user}, null, {message: 'retrieved user'})
    } catch (error) {
        res.status(400).send(error)
    }
}


module.exports = userController