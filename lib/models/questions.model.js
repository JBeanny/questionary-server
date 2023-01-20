const fs = require("fs");
const mongoose = require("mongoose");

const path = `${__dirname}/../../data/questions.json`;

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  answers: [
    {
      option: {
        type: String,
        required: true,
      },
      chosen: {
        type: Number,
        required: false,
        default: 0,
      },
    },
  ],
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
