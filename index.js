const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
require("express-async-errors");
const app = express();
const employees = require("./routes/employees");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const logger = require("./config/logger");
const compression = require("compression");

mongoose
  .connect("mongodb://localhost/mycompany")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(() => {
    logger.error("error connecting to DB: " + error);
  });

app.use(compression());
app.use(express.json());
app.use(helmet());
app.use("/api/employees", employees);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Page not found!",
  });
});

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

app.get("/", (req, res) => {
  res.send("You entered the homepage");
});

const port = process.env.port || 3000;
app.listen(port, () => logger.info("app working on port: " + port));
