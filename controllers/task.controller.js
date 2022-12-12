const { sendResponse, AppError } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");


const taskController = {};
//filter date, status, search for descrip and task name
taskController.getAllTasks = async (req, res, next) => {
  const allowedFilter = ['status','createdAt', 'updatedAt']


  try {
    let {...filterQuery} = req.query

    const filterKeys = Object.keys(filterQuery)
    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new AppError(401, `Query ${key} is not allowed`, 'Get tasks unsuccess');
        throw exception;
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });

    const listOfTasks = await Task.find({});

    let result = []
    if(filterKeys.length){
      filterKeys.map((condition)=> {
        if(condition == 'status'){
          filterByStatus = listOfTasks.filter((task)=> task.status.includes(filterQuery[condition]))
          result = filterByStatus
        }
      })
    }
    // if(status) listOfTasks.filter((task)=> task.status.includes(status))

    sendResponse(res, 200, true, { tasks: result  }, null, {
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
  let {taskId} = req.params
  let {role, status} = req.body
  let updateInfo = req.body
  let options = {new:true}
  const workState = ["pending","working",'review','done','archived']

  
  try {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name',
    'description',
    'assignee',
    'status',
    'assignedBy','role']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  //check role to authorize update task
  if(role !== 'manager') throw new AppError(403, "not allowed", "update task failed")
  // check status from task and match with the req from body
  const task = await Task.findById(taskId)
  const updatedTask = await Task.findByIdAndUpdate(taskId,updateInfo, options)

  switch (task.status) {
    // case status:
    //   // sendResponse(res,200,true,{updatedTask}, null,{message: 'update task success'})
    //     break
    case 'pending':
      sendResponse(res,200,true,{updatedTask}, null,{message: 'update task success'})
        break;
    case 'working':
      sendResponse(res,200,true,{updatedTask}, null,{message: 'update task success'})
        break
    case 'review':
      sendResponse(res,200,true,{updatedTask}, null,{message: 'update task success'})
        break
    case 'done':
      if(status !== 'archived') throw new AppError(404, "done task cannot be change", 'update task failed')
      sendResponse(res,200,true,{updatedTask}, null,{message: 'update task success'})

        break
    case 'archived':
      if(status !== 'archived') throw new AppError(404, 'cannot change archived task', 'task update failed')

      sendResponse(res,200,true,{updatedTask}, null,{message: 'update task success'})
        break
    default:
      return task
  }

  
  
  
  
  //employee can change from pending to review, cannot change back from review
  //manager change review - done - archived
  //task done can only change to archived
  //task archived is permanent

  //update task
  // const updatedTask = await Task.findByIdAndUpdate(id,updateInfo, options)
  // sendResponse(res,200,true,{updatedTask}, null,{message: 'update task success'})

  
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
