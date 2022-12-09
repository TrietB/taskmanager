const { sendResponse, AppError } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");


const taskController = {};
//filter date, status, search for descrip and task name
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

//check for exist user, check role
taskController.createTask = async (req, res, next) => {
  let { name, description, assignee, status, assignedBy } = req.body;
  console.log(assignedBy)
  try {
    if(!name|| !description || !status || !assignedBy) throw new AppError(401,"Missing info",'failed to create')
    let assignBy = await User.findOne({name:assignedBy})
    console.log(assignBy)
    if(assignBy.role == 'employee') throw new AppError(404, "Not authorize", "failed to create task")
    const newTask = await new Task({
      name: name,
      description: description,
      assignee: assignee,
      status: status,
      assignedBy: assignBy._id
    });
    
    if(assignee) {
      const user = await User.findOne({name: assignee})
      user.tasks.push(newTask)
      user.save()
    }
   
    const created = await Task.create(newTask)
    sendResponse(res,200,true,{task:created},null,{message:'Create task success'})
  } catch (error) {
    next(error);
  }
};

//check role, check status 
//done => check request for "archived"
taskController.updateTask = async (req,res,next) => {
//check role before update task
  let {id} = req.params
  let {role, status, ...updateInfo} = req.body
  let options = {new:true}
  const workState = ["pending","working",'review','done','archived']
try {
  if(role == "employee") throw new AppError(400,"not authorized", 'update task failed')
  switch (status) {
    case 'pending':
      
      break;
    case 'working':
      break
    case 'review':
      break
    case 'done':
      break
    case 'archived':
      break
    default:
      break;
  }
} catch (error) {
  next(error)
}
}

//move to task.controller
taskController.getTaskOfUser = async (req,res,next) => {

  let {name} = req.params

  try {
      const task = await Task.find({assignee: name})
      if(!task)
      sendResponse(res,200,true,{userTask: task},null,{message:"get user's task successful"})
  } catch (error) {
      next(error)
  }

}

module.exports = taskController
