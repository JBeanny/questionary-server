const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const http = require("http");
const notification = require("./lib/middlewares/notification");

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("HELLO FROM VOTING APPLICATION SERVER");
});

const QUESTION_API = require("./lib/routes/question.routes");
const OPTION_API = require("./lib/routes/options.routes");

app.use("/api/v1/questions", QUESTION_API);
app.use("/api/v1/options", OPTION_API);

const server = http.createServer(app);

//to send notificatin when tasks are out of date
notification(server);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
