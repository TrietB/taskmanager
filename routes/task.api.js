const express = require("express");

const {
  getAllTasks,
  createTask,
  getTaskOfUser,
  updateTask,
  deleteTask,
  getTaskById,
} = require("../controllers/task.controller");

const router = express.Router({mergeParams: true});

/**
 * @route GET api/task
 * @description get All tasks, filter task by status, createdAt, updatedAt, assignee
 * @access private, manager
 * @allowQueries: task id, assignee, createdAt, updateAt
 */
router.get("/", getAllTasks);

/**
 * @route POST api/task
 * @description create new task
 * @access private, manager
 * @requiredBody: role, name, description, status, assignedBy
 */
router.post("/", createTask);

/**
 * @route GET api/task
 * @description get single task by Id
 * @access private, manager
 * @requiredParams taskId - Mongodb ObjectId
 */
router.get("/:taskId", getTaskById);

/**
 * @route GET api/task
 * @description get task of a user by username
 * @access private, manager
 * @requiredParams: user "name"
 */
router.get("/userTask/:name", getTaskOfUser);



/**
 * @route PUT api/task
 * @description get single task by Id
 * @access private, manager
 * @requiredParams: taskId
 * @requiredBody: 
 *    "name",
      "description",
      "assignee",
      "status",
      "assignedBy",
      "userId",
 */
router.put("/:taskId", updateTask);

/**
 * @route delete api/task
 * @description soft delete task by id
 * @access private, manager
 * @requiredParams: taskId
 */
router.delete("/:taskId", deleteTask);



module.exports = router;
