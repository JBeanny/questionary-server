const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const http = require("http");
const notification = require("./lib/middlewares/notification");

app.use(cors());
app.use(bodyParser.json());

// routes path
const QUESTION_API = require("./lib/routes/question.routes");
const OPTION_API = require("./lib/routes/options.routes");

// routes
app.use("/api/v1/questions", QUESTION_API);
app.use("/api/v1/options", OPTION_API);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "Fail",
    message: err.message,
  });
});

const server = http.createServer(app);

//to send notificatin when tasks are out of date
notification(server);

module.exports = server;
