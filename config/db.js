const azure = require("azure-storage");
const { config } = require("./config");

const tableService = azure.createTableService(config.dbString);

tableService.createTableIfNotExists(
  "todos",
  function (error, result, response) {
    if (!error && result.created) {
      console.log("todos table created successully");
    }
  }
);

module.exports = { tableService };
