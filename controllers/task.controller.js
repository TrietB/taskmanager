const { sendResponse, AppError } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");


const taskController = {};

taskController.getAllTasks = async (req, res, next) => {
  try {
    const listOfTasks = await Task.find({});

    sendResponse(res, 200, true, { tasks: listOfTasks }, null, {
      message: "Get list of tasks success",
    });
  } catch (error) {
    next(error);
  }
};

taskController.getTaskByName = async (req,res,next) => {
  let {name} = req.params
  console.log(name)
  try{
    const task = await Task.findOne({name:name})

    sendResponse(res,200,true,{task: task}, null, {message:"get single task success"})
  } catch(err){
    next(err)
  }
}

taskController.createTask = async (req, res, next) => {
  let { name, description, assignee, status } = req.body;
  try {
    if(!name|| !description || !status) throw new AppError(401,"Missing info",'failed to create')
    const newTask = await new Task({
      name: name,
      description: description,
      assignee: assignee,
      status: status,
    });

    const user = await User.findOne({name: assignee})

    user.tasks.push(newTask)
    user.save()
   

    const created = await Task.create(newTask)
    sendResponse(res,200,true,{task:created},null,{message:'Create task success'})
  } catch (error) {
    next(error);
  }
};

taskController.getUserTask = async (req,res,next) => {

}

module.exports = taskController
