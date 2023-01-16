const UsersModel = require("../models/users.model");
const QuestionsModel = require("../models/questions.model");

class OptionsController {
  addOption(req, res) {
    const qid = req.query.question * 1;
    const body = req.body;

    const questions = QuestionsModel.getQuestions();

    const question = questions.find((question) => question.id === qid);
    if (!question) {
      return res.status(404).json({ status: "Not Found" });
    }
    body.forEach((data) => {
      const answer = {
        id: question.answers.length + 1,
        option: data.option,
        chosen: data.chosen,
      };

      question.answers.push(answer);
    });

    questions.forEach((quest) => {
      if (quest.id === question.id) {
        quest = question;
      }
    });

    try {
      QuestionsModel.createQuestion(questions);
      return res.status(200).json({
        status: "Success",
        message: "Successfully Added",
      });
    } catch (error) {
      return res.status(400).json({
        status: "Fail",
        message: error,
      });
    }
  }

  deleteOption(req, res) {
    const query = req.query.question * 1;
    const id = req.params.id * 1;

    const questions = QuestionsModel.getQuestions();

    const question = questions.find((question) => question.id === query);

    const option = question?.answers.find((option) => option.id === id) || null;

    if (!question || !option) {
      return res.status(404).json({
        status: "Not Found",
      });
    }
    const newAnswers = question.answers.filter((opt) => opt.id !== option.id);
    question.answers = newAnswers;
    questions.forEach((quest) => {
      if (quest.id === question.id) {
        quest = question;
      }
    });

    try {
      QuestionsModel.createQuestion(questions);
      return res.status(200).json({
        status: "Success",
        message: "Successfully Deleted",
      });
    } catch (error) {
      return res.status(400).json({
        status: "Fail",
        message: error,
      });
    }
  }

  addVote(req, res) {
    const id = req.params.id * 1;
    const query = req.query.question * 1;

    const questions = QuestionsModel.getQuestions();
    // console.log(questions);

    const question = questions.find((question) => question.id === query);
    const option = question?.answers.find((option) => option.id === id) || null;

    if (!question || !option) {
      return res.status(404).json({
        status: "Not Found",
      });
    }
    option.chosen = option.chosen * 1 + 1;
    questions.forEach((quest) => {
      if (quest.id === question.id) {
        quest = question;
      }
    });

    let users = UsersModel.getUsers();

    let user = users.find((user) => user.uid === req.body.uid);

    if (!user) {
      users.push({
        uid: req.body.uid,
        username: `user-${req.body.uid}`,
        voted_questions: [],
      });
      UsersModel.createUser(users);
    }
    user = users.find((user) => user.uid === req.body.uid);

    const isVoteExisted = user.voted_questions.find(
      (voted) => voted.qid === question.id
    );

    if (!isVoteExisted) {
      user.voted_questions.push({
        qid: question.id,
        voted_option: id,
        voted_date: new Date(),
      });
    } else {
      return res.status(403).json({
        status: "Fail",
        message: "User already voted this question",
      });
    }

    try {
      QuestionsModel.createQuestion(questions);

      UsersModel.createUser(users);

      return res.status(200).json({
        status: "Success",
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
