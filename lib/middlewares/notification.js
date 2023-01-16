const schedule = require("node-schedule");
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("User connected");
});

const sendNotification = schedule.scheduleJob("*/5 * * * *", () => {
  // Check for tasks that are out of deadline
  let outOfDeadlineTasks = getOutOfDeadlineTasks();
  if (outOfDeadlineTasks.length > 0) {
    io.emit("deadline-notification", outOfDeadlineTasks);
  }
});

function getOutOfDeadlineTasks() {
  // Code to fetch tasks that are out of deadline
  // from the database and return them
}
