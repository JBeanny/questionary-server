const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const schedule = require("node-schedule");
const { Server } = require("socket.io");
const http = require("http");
const fs = require("fs");

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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log(`UID: ${socket.id} is logged in`);
  // run every 5s
  schedule.scheduleJob("question-schedule", "*/5 * * * * *", () => {
    let outOfDeadlineTasks = getOutOfDeadlineTasks();

    if (outOfDeadlineTasks.length > 0) {
      outOfDeadlineTasks.forEach((task) => {
        if (task) {
          let totalVote = 0;
          task.answers.forEach((answer) => (totalVote += answer.chosen));

          socket.emit("notification", {
            message: `QID: ${task.id} is expired`,
            description: `Question: ${task.question} with ${totalVote} total votes`,
          });
        }
      });
    }
    schedule.cancelJob("question-schedule");
  });

  socket.emit("get-uid", {
    uid: socket.id,
  });
});

function getOutOfDeadlineTasks() {
  const questions = JSON.parse(
    fs.readFileSync(`${__dirname}/data/questions.json`, "utf-8")
  );

  const today = new Date();

  const outOfDate = questions.map((question) => {
    if (question.end_date >= String(today)) {
      return question;
    }
  });
  return outOfDate || [];
}

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
