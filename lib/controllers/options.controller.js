const UserModel = require("../models/users.model");
const QuestionModel = require("../models/questions.model");

class OptionsController {
  async addOption(req, res) {
    const qid = req.query.question;
    const body = req.body;

    const question = await QuestionModel.findById(qid);

    if (!question) {
      return res.status(404).json({ status: "Not Found" });
    }
    body.forEach((data) => {
      const answer = {
        option: data.option,
        chosen: data.chosen,
      };

      question.answers.push(answer);
    });

    try {
      const updatedQuestion = await QuestionModel.findByIdAndUpdate(
        qid,
        question,
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        status: "Success",
        data: {
          updatedQuestion,
        },
        message: "Successfully Added",
      });
    } catch (error) {
      return res.status(400).json({
        status: "Fail",
        message: error,
      });
    }
  }

  async deleteOption(req, res) {
    const query = req.query.question;
    const id = req.params.id;

    const question = await QuestionModel.findById(query);

    const option = question?.answers.find((option) => option.id === id) || null;

    if (!question || !option) {
      return res.status(404).json({
        status: "Not Found",
      });
    }
    const newAnswers = question.answers.filter((opt) => opt.id !== option.id);
    question.answers = newAnswers;

    try {
      const updatedQuestion = await QuestionModel.findByIdAndUpdate(
        query,
        question,
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        status: "Success",
        data: {
          updatedQuestion,
        },
        message: "Successfully Deleted",
      });
    } catch (error) {
      return res.status(400).json({
        status: "Fail",
        message: error,
      });
    }
  }

  async addVote(req, res) {
    const id = req.params.id;
    const query = req.query.question;

    const question = await QuestionModel.findById(query);

    const option = question?.answers.find((option) => option.id === id) || null;

    if (!question || !option) {
      return res.status(404).json({
        status: "Not Found",
      });
    }

    let user = await UserModel.findOne({ uid: req.body.uid });
    // console.log(user);
    if (!user) {
      const newUser = new UserModel({
        uid: req.body.uid,
        username: `user-${req.body.uid}`,
        voted_questions: [],
      });
      await newUser.save();
    }
    user = await UserModel.findOne({ uid: req.body.uid });
    const isVoteExisted = user.voted_questions.find(
      (voted) => voted.qid === question.id
    );

    if (!isVoteExisted) {
      user.voted_questions.push({
        qid: question.id,
        voted_option: id,
        voted_date: new Date(),
      });
      option.chosen = option.chosen * 1 + 1;
    } else {
      return res.status(403).json({
        status: "Fail",
        message: "User already voted this question",
      });
    }

    try {
      const updateQuestion = await QuestionModel.findByIdAndUpdate(
        query,
        question,
        {
          new: true,
          runValidators: true,
        }
      );

      const updatedUser = await UserModel.findOneAndUpdate(
        { uid: req.body.uid },
        user
      );

      return res.status(200).json({
        status: "Success",
        data: {
          question: updateQuestion,
          user: updatedUser,
        },

        message: "Successfully Updated",
      });
    } catch (error) {
      return res.status(200).json({
        status: "Fail",
        message: error,
      });
    }
  }
}

module.exports = new OptionsController();
