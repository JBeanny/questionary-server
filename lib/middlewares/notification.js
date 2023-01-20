const schedule = require("node-schedule");
const { Server } = require("socket.io");
const fs = require("fs");

const notification = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
      console.log(data.ID);
      socket.join(data.ID);
    });

    const questions = JSON.parse(
      fs.readFileSync(`${__dirname}/../../data/questions.json`, "utf-8")
    );

    questions.forEach((question) => {
      const date = new Date(question.end_date).toLocaleString();

      const questionSchedule = schedule.scheduleJob(date, () => {
        let outOfDeadlineTasks = getOutOfDeadlineTasks(date);
        let totalOutDated = [];
        let users = [];

        if (outOfDeadlineTasks.length > 0) {
          outOfDeadlineTasks.forEach((task) => {
            users = [...users, getRelatedUsers(task)];
            let totalVote = 0;
            if (task) {
              task.answers.forEach((answer) => (totalVote += answer.chosen));
              totalOutDated.push({
                id: task.id,
                question: task.question,
                votes: totalVote,
              });
            }
          });
        }

        users.forEach((user) => {
          socket.to(user.uid).emit("notification", {
            notification: totalOutDated,
          });
        });

        questionSchedule.cancel();
      });
    });

    socket.emit("get-uid", {
      uid: socket.id,
    });
  });
};

function getRelatedUsers(outOfDateQuestion) {
  const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../../data/users.json`, "utf-8")
  );

  let relatedUser;
  users.forEach((user) => {
    user.voted_questions.forEach((voted) => {
      if (voted.qid === outOfDateQuestion.id) relatedUser = user;
    });
  });
  return relatedUser;
}

function getOutOfDeadlineTasks(date) {
  const questions = JSON.parse(
    fs.readFileSync(`${__dirname}/../../data/questions.json`, "utf-8")
  );
  const outOfDate = [];
  questions.forEach((question) => {
    const deadline = new Date(question.end_date).toLocaleString();

    if (deadline === date) {
      return outOfDate.push(question);
    }
  });
  return outOfDate;
}

module.exports = notification;
