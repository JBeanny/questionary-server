const QuestionModel = require("../models/questions.model");

class QuestionController {
  async getQuestions(req, res) {
    try {
      const questions = await QuestionModel.find();

      return res.status(200).json({
        status: "Success",
        result: questions.length,
        data: { questions: questions },
      });
    } catch (error) {
      // return res.status(400).json({
      //   status: "Fail",
      //   message: error,
      // });
      // console.error(error);
      throw new Error(error);
    }
  }

  async createQuestion(req, res) {
    try {
      const body = req.body;

      const data = {
        question: body.question,
        answers: body.answers,
        start_date: body.start_date,
        end_date: body.end_date,
      };

      const quest = new QuestionModel(data);
      await quest.save();

      return res.status(201).json({
        status: "Success",
        message: "Successfully Created",
      });
    } catch (error) {
      // return res.status.json({
      //   status: "Fail",
      //   message: error,
      // });
      throw new Error(error);
    }
  }

  async deleteQuestion(req, res, next) {
    try {
      const id = req.params.id;
      const deletedQuestion = await QuestionModel.findOneAndDelete({ _id: id });

      if (!deletedQuestion) {
        return next(new NotFoundError(`Question ${id} is not found`));
      }

      return res.status(200).json({
        status: "Success",
        data: {
          deletedQuestion,
        },
        message: "Successfully Deleted",
      });
    } catch (error) {
      // return res.status(400).json({
      //   status: "Fail",
      //   message: error,
      // });
      throw new Error(error);
    }
  }

  async editQuestion(req, res, next) {
    const id = req.params.id;
    const data = req.body;

    try {
      const updatedQuestion = await QuestionModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: "Success",
        data: {
          updatedQuestion,
        },
        message: "Successfully Updated",
      });
    } catch (error) {
      // res.status(400).json({
      //   status: "Fail",
      //   message: error,
      // });
      throw new Error(error);
    }
  }

  async getTrendingQuestions(req, res) {
    try {
      const questions = await QuestionModel.find();
      let trends = questions.map((question) => ({
        ...question._doc,
        total_votes: question._doc.answers.reduce(
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
      // res.status(500).json({
      //   status: "Fail",
      //   message: error,
      // });
      throw new Error(error);
    }
  }
}

module.exports = new QuestionController();
