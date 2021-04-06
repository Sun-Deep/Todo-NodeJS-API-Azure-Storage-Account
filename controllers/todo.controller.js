const azure = require("azure-storage");

const { Todo } = require("../models/todo.model");
const { tableService } = require("../config/db");

/**
 * @desc  Register Todo
 */

const todoRegister = async (req, res, next) => {
  try {
    let todoInfo = req.body;
    let rowKey = Date.now().toString();

    let todo = {
      PartitionKey: { _: "todo" },
      RowKey: { _: rowKey },
      done: { _: todoInfo.done },
      title: { _: todoInfo.title },
      createdAt: { _: new Date(), $: "Edm.DateTime" },
    };
    tableService.insertEntity(
      "todos",
      todo,
      { echoContent: true },
      function (error, result, response) {
        if (!error) {
          res.status(201).json({
            success: true,
            data: {
              title: result.title._,
              done: result.done._,
              createdAt: result.createdAt._,
              _id: result.RowKey._,
            },
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/**
 * @desc get all todos
 */

const getTodos = async (req, res, next) => {
  try {
    var query = new azure.TableQuery().where("PartitionKey eq ?", "todo");
    tableService.queryEntities(
      "todos",
      query,
      null,
      function (error, result, response) {
        if (!error) {
          let data = [];
          result.entries.forEach((e) => {
            data.push({
              title: e.title._,
              done: e.done._,
              createdAt: e.createdAt._,
              _id: e.RowKey._,
            });
          });
          return res.status(200).json({
            success: true,
            data: data,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/**
 * @desc update todo status
 */

const updateTodo = async (req, res, next) => {
  try {
    const rowKey = req.params.id;
    tableService.retrieveEntity(
      "todos",
      "todo",
      rowKey,
      function (error, result, response) {
        if (!error) {
          // result contains the entity
          let todo = {
            title: result.title._,
            done: result.done._,
            createdAt: result.createdAt._,
          };

          let updatedTodo = {
            PartitionKey: { _: "todo" },
            RowKey: { _: rowKey },
            done: { _: !todo.done },
            title: { _: todo.title },
            createdAt: { _: todo.createdAt, $: "Edm.DateTime" },
          };

          tableService.replaceEntity(
            "todos",
            updatedTodo,
            function (error, result, response) {
              if (!error) {
                return res.status(201).json({
                  success: true,
                  data: {
                    title: todo.title,
                    done: !todo.done,
                    createdAt: todo.createdAt,
                    _id: rowKey,
                  },
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/**
 * @desc delete todo by id
 */

const deleteTodo = async (req, res, next) => {
  try {
    const rowKey = req.params.id;
    let todo = {
      PartitionKey: { _: "todo" },
      RowKey: { _: rowKey },
    };
    tableService.deleteEntity("todos", todo, function (error, response) {
      if (!error) {
        return res.status(201).json({
          success: true,
          data: {
            _id: rowKey,
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { todoRegister, getTodos, updateTodo, deleteTodo };
