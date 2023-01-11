const { sendResponse, AppError } = require("../helpers/utils");
const Task = require("../models/Task");
const User = require("../models/User");
const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

const taskController = {};
//filter date, status, search for descrip and task name
taskController.getAllTasks = async (req, res, next) => {
  const allowedFilter = ["status", "createdAt", "updatedAt","assignee"];

  try {
    let { ...filterQuery } = req.query;

    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new AppError(
          401,
          `Query ${key} is not allowed`,
          "Get tasks unsuccess"
        );
        throw exception;
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });

    const listOfTasks = await Task.find({ deleted: false });

    if (filterKeys.length) {
      filterKeys.map(async (condition) => {
        switch (condition) {
          case "status":
            const filterByStatus = listOfTasks.filter((task) =>
              task.status.includes(filterQuery[condition])
            );
            sendResponse(res, 200, true, { tasks: filterByStatus }, null, {
              message: `get list of ${filterQuery[condition]} success`,
            });
            break;
          case "createdAt":
            let createDate = new Date(filterQuery[condition]);
            let endDate = moment(createDate).add(1, "days");
            // let endDate = today.setDate(today.getDate() + 1)
            let filterByCreatedAt = await Task.find({
              createdAt: { $gte: createDate, $lt: endDate },
            });
            sendResponse(
              res,
              200,
              true,
              {
                tasks: filterByCreatedAt.length
                  ? filterByCreatedAt
                  : "not found",
              },
              null,
              {
                message: filterByCreatedAt.length
                  ? "get tasks by filter success"
                  : "task not found",
              }
            );
            break;
          // console.log(today, endDate, filterByCreatedAt)
          case "updatedAt":
            let updatedDate = new Date(filterQuery[condition]);
            let end = moment(updatedDate).add(1, "days");
            // let endDate = today.setDate(today.getDate() + 1)
            let filterByUpdatedAt = await Task.find({
              updatedAt: { $gte: updatedDate, $lt: end },
            });
            sendResponse(
              res,
              200,
              true,
              {
                tasks: filterByUpdatedAt.length
                  ? filterByUpdatedAt
                  : "not found",
              },
              null,
              {
                message: filterByUpdatedAt.length
                  ? "get tasks by filter success"
                  : "task not found",
              }
            );

            break;
          case 'assignee':
            const assignee = filterQuery[condition].toLowerCase()
            const user = await User.find({name: assignee}).select('_id')
            const {_id} = user[0]
            console.log(_id.toString())
            if(!user) throw new AppError(404, 'Assignee not found', 'get task by username failed')
            console.log(listOfTasks)
            const filterByAssignee = listOfTasks.filter((task)=> task.assignee.includes(_id.toString()))
            if(!filterByAssignee) throw new AppError(404, 'Assignee has no task', 'get task by username failed')
            sendResponse(res,200,true,{tasks: filterByAssignee}, null,{message:'get all tasks success'})
          break
          default:
            break;
        }
      });
    } else {
      sendResponse(res, 200, true, { tasks: listOfTasks }, null, {
        message: "Get list of tasks success",
      });
    }
  } catch (error) {
    next(error);
  }
};

taskController.getTaskById = async (req, res, next) => {
  let { taskId } = req.params;
  console.log(taskId);
  try {
    if (!taskId)
      throw new AppError(402, "Required task name", "get single task failed");
    if (!ObjectId.isValid(taskId))
      throw new AppError(402, "Not mongo ObjectId", "get single task failed");
    const tasks = await Task.find({ deleted: false });

    // const task = await Task.findById(taskId);
    const task = tasks.find((task) => task._id == taskId);
    if (!task)
      throw new AppError(
        402,
        `No task with id ${taskId}`,
        "get single task failed"
      );
    sendResponse(res, 200, true, { task: task }, null, {
      message: "get single task success",
    });
  } catch (err) {
    next(err);
  }
};

//check for exist user, check role
taskController.createTask = async (req, res, next) => {
  let { name, description, assignee, status, assignedBy } = req.body;
  console.log(assignedBy);
  try {
    if (!name || !description || !status || !assignedBy)
      throw new AppError(
        401,
        "Required name, description, status, assignedBy",
        "failed to create"
      );
    let assignBy = await User.findById(assignedBy);
    console.log(assignBy);
    if (!assignBy)
      throw new AppError(404, "User not exist", "failed to create task");
    if (assignBy.role == "employee")
      throw new AppError(404, "Not authorize", "failed to create task");
    const newTask = await new Task({
      name: name,
      description: description,
      assignee: assignee,
      status: status,
      assignedBy: assignBy._id,
    });

    if (assignee) {
      const user = await User.findOne({ name: assignee });
      user.tasks.push(newTask);
      user.save();
    }

    const created = await Task.create(newTask);
    sendResponse(res, 200, true, { task: created }, null, {
      message: "Create task success",
    });
  } catch (error) {
    next(error);
  }
};

//check role, check status
//done => check request for "archived"
taskController.updateTask = async (req, res, next) => {
  //check role before update task
  let { taskId } = req.params;
  let { userId, status, assignee, name, description,  } = req.body;
  let updateInfo = {
    name,
    status,
    description,
    assignee
  }
  let options = {upsert: true, new: true };
  let allowedStatus = ['pending','working','review','done','archived']
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "description",
      "assignee",
      "status",
      "assignedBy",
      "userId",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
      );
    if (!isValidOperation)throw new AppError(400, "Invalid updates!", "update unsuccess");
    //check for correct status
    const isValidStatus = allowedStatus.find((validStatus)=> validStatus === status)
    if(!isValidStatus && status) throw new AppError(404, "status not allow", "no task found")

    //check for assigned user
    const assignPerson = await User.findById(assignee)
    if(!assignPerson) throw new AppError(404, "assigned person not exist", "no user found")
    
    const task = await Task.findById(taskId);
    //check role to authorize update task
    //check userId if manager
    if (!task) throw new AppError(404, "task not exist", "no task found");
    if (
      // task.assignee.toString() !== userId &&
      task.assignedBy.toString() !== userId
    )
      throw new AppError(403, "not allowed", "update task failed");

    // check status from task and match with the req from body
    let user = await User.findById(userId);
    if (status !==undefined) {
      if (user.role === "manager") {
        switch (task.status) {
          case "done":
          case "archived":
            if (status !== "archived")
              throw new AppError(
                404,
                "cannot change done, archived task",
                "task update failed"
              );
            break;
          default:
            break;
        }

        const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          updateInfo,
          options
        );

        sendResponse(res, 200, true, { updatedTask }, null, {
          message: "update task success",
        });
      } else {
        switch (task.status) {
          case "done":
          case "archived":
            throw new AppError(
              404,
              "cannot change archived task",
              "task update failed"
            );
          default:
            break;
        }
        const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          updateInfo,
          options
        );
        sendResponse(res, 200, true, { updatedTask }, null, {
          message: "update task success",
        });
      }
    }
    
    if(task.assignee.includes(assignee)) {
      throw new AppError(404, "user already assign to task", "assign task failed")
    } else if(task.assignee.length >= 0) {
      task.assignee.push(assignee)
      assignPerson.tasks.push(task._id)
      assignPerson.save()
    }
    
    updateInfo.assignee = task.assignee

    console.log(assignPerson)
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateInfo,
      options
    );
    sendResponse(res, 200, true, { updatedTask }, null, {
      message: "update task success",
    });
  } catch (error) {
    next(error);
  }
};

taskController.getTaskOfUser = async (req, res, next) => {
  let { name } = req.query
  try {
    const user = await User.find({ name: name.toLowerCase() });
    const {_id} = user
    console.log(user)
    const task = await Task.find({ assignee: user._id, deleted: false });
    if (!task)
      throw new AppError(404, "task not found", "get user task failed");
    sendResponse(res, 200, true, { userTask: task }, null, {
      message: "get user's task successful",
    });
  } catch (error) {
    next(error);
  }
};

taskController.deleteTask = async (req, res, next) => {

  try {
    let { taskId } = req.params;
    if (!ObjectId.isValid(taskId))
      throw new AppError(402, "Not mongo ObjectId", "get single task failed");
    let toBeDeleted = await Task.findById(taskId);
    if (!toBeDeleted)
      throw new AppError(400, "task not found", "no task in DB");
//soft detele using mongoose soft delete package
    toBeDeleted.delete();
    sendResponse(res, 200, true, { deletedTask: toBeDeleted }, null, {
      message: "delete task success",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
