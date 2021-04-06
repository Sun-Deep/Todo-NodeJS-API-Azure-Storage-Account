const express = require("express");
const cors = require("cors");

require("./config/db");
const apiRoutes = require("./routes");
const { config } = require("./config/config");

const app = express();
app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/api", apiRoutes);

// 404 Error Handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Internal Error Handler
app.use((err, req, res, next) => {
  const status_code = err.status || 500;
  console.log(err);
  res.status(status_code).json({
    success: false,
    error: res.status === 404 ? err.message : "Something Went Wrong",
  });
});

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log("Server Running at localhost:3001");
  }
});
