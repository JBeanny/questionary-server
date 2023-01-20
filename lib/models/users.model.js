const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, "ID is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  voted_questions: [
    {
      qid: {
        type: String,
      },
      voted_option: {
        type: String,
      },
      voted_date: {
        type: Date,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
