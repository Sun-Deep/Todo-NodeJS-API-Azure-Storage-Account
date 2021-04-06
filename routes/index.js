const express = require("express");
const todosRoutes = require("./todo.routes");

const routes = express.Router();

// todos
routes.use("/todos", todosRoutes);

module.exports = routes;
