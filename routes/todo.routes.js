const express = require("express");

const {
  todoRegister,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo.controller");

const router = express.Router();

/**
 * @route  POST /api/todos/
 * @desc   Register todo
 * @access Public
 */

router.post("/", todoRegister);

/**
 * @route  GET /api/todos/
 * @desc   Get todos
 * @access Public
 */

router.get("/", getTodos);

/**
 * @route  PUT /api/todos/
 * @desc   Update Status by Id
 * @access Public
 */

router.put("/:id", updateTodo);

/**
 * @route  DELETE /api/todos/
 * @desc   Delete todo by Id
 * @access Public
 */

router.delete("/:id", deleteTodo);

module.exports = router;
