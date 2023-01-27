const schedule = require("node-schedule");
const { Server } = require("socket.io");
const QuestionsModel = require("../models/questions.model");
const UsersModel = require("../models/users.model");

const notification = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    // join room with socket.id
    socket.on("join_room", (data) => {
      console.log(data.ID);
      socket.join(data.ID);
    });

    //fetch questinos from db
    const questions = await QuestionsModel.find();

    questions.forEach((question) => {
      // convert string date to Date object
      const date = new Date(question.end_date).toLocaleString();

      //set schedule to each questions
      const questionSchedule = schedule.scheduleJob(date, async () => {
        //get out of date questions
        let outOfDeadlineTasks = await getOutOfDeadlineTasks(date);
        // notifications
        let totalOutDated = [];
        // users
        let users;

        // console.log(outOfDeadlineTasks);
        if (outOfDeadlineTasks.length > 0) {
          outOfDeadlineTasks.forEach(async (task) => {
            // console.log(task);
            let totalVote = 0;

            // notifications objects
            if (task) {
              task.answers.forEach((answer) => (totalVote += answer.chosen));
              totalOutDated.push({
                id: task.id,
                question: task.question,
                votes: totalVote,
              });
            }
            // get related users
            users = await getRelatedUsers(task);
            // send notification to each related users
            users.forEach((user) => {
              socket.to(user.uid).emit("notification", {
                notification: totalOutDated,
              });
            });
          });
        }

        //cancelling a job
        questionSchedule.cancel();
      });
    });

    // emit UID to clients
    socket.emit("get-uid", {
      uid: socket.id,
    });
  });
};

// get related users function
async function getRelatedUsers(outOfDateQuestion) {
  const data = [];
  //fetch users from db
  const users = await UsersModel.find();

  // find related users for a question
  users.forEach((user) => {
    user.voted_questions.forEach((voted) => {
      if (voted.qid === outOfDateQuestion.id) data.push(user);
    });
  });
  return data;
}

// get out of date questions
async function getOutOfDeadlineTasks(date) {
  // fetch questions from db
  const questions = await QuestionsModel.find();

  const outOfDate = [];

  // get out of date questions
  questions.forEach((question) => {
    // convert string end_date into Date Object
    const deadline = new Date(question.end_date).toLocaleString();

    // compare deadline and date
    if (deadline === date) {
      return outOfDate.push(question);
    }
  });
  return outOfDate;
}

module.exports = notification;
