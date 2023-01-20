const QuestionsModel = require("../models/questions.model");

class QuestionController {
  getQuestions(req, res) {
    const questions = QuestionsModel.getQuestions();

    try {
      return res.status(200).json({
        statu: "Success",
        data: { questions: questions },
      });
    } catch (error) {
      return res.status(400).json({
        status: "Fail",
        message: error,
      });
    }
  }

  createQuestion(req, res) {
    const questions = QuestionsModel.getQuestions();

    try {
      const body = req.body;

      const data = {
        id: questions[questions.length - 1].id + 1,
        question: body.question,
        answers: body.answers,
        start_date: body.start_date,
        end_date: body.end_date,
      };

      const newData = [...questions, data];
      // fs.writeFileSync(QUESTION_PATH, JSON.stringify(newData));
      QuestionsModel.createQuestion(newData);
      return res.status(201).json({
        status: "Success",
        message: "Successfully Created",
      });
    } catch (error) {
      return res.status.json({
        status: "Fail",
        message: error,
      });
    }
  }

  deleteQuestion(req, res) {
    const questions = QuestionsModel.getQuestions();

    try {
      const id = req.params.id * 1;
      const newData = questions.filter((question) => question.id !== id);
      if (newData.length === questions.length) {
        return res.status(404).json({
          status: "Not Found",
        });
      }
      // fs.writeFileSync(QUESTION_PATH, JSON.stringify(newData));
      QuestionsModel.createQuestion(newData);
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

  editQuestion(req, res) {
    const questions = QuestionsModel.getQuestions();

    const id = req.params.id * 1;
    let question = questions.find((question) => question.id === id);

    if (!question) {
      return res.status(404).json({
        status: "Not Found",
      });
    }

    question = { id: id, ...req.body };

    const updatedQuestions = questions.map((quest) => {
      if (quest.id === id) {
        return question;
      }
      return quest;
    });

    try {
      // fs.writeFileSync(QUESTION_PATH, JSON.stringify(updatedQuestions));
      QuestionsModel.createQuestion(updatedQuestions);

      res.status(200).json({
        status: "Success",
        message: "Successfully Updated",
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        message: error,
      });
    }
  }

  getTrendingQuestions(req, res) {
    try {
      const questions = QuestionsModel.getQuestions();

      // get all votes of each question

      // let trends = questions.map((question) => {
      //   let votes = 0;
      //   question.answers.forEach((option) => (votes += option.chosen));
      //   return {
      //     ...question,
      //     total_votes: votes,
      //   };
      // });

      //or this

      let trends = questions.map((question) => ({
        ...question,
        total_votes: question.answers.reduce(
          (prev, cur) => prev + cur.chosen,
          0
        ),
      }));

      trends = trends.sort((a, b) => b.total_votes - a.total_votes);

      res.status(200).json({
        status: "Success",
        trends: trends,
      });
    } catch (error) {
      res.status(500).json({
        status: "Fail",
        message: error,
      });
    }
  }
}

module.exports = new QuestionController();
