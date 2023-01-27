const UsersModel = require("../models/users.model");
const QuestionsModel = require("../models/questions.model");
const NotFoundError = require("../helper/ErrorMessages");

class Middlewares {
  checkReqBody(req, res, next) {
    if (req.body) {
      return next();
    }
    return res.status(400).json({
      status: "Fail",
      message: "Invalid Request Body",
    });
  }

  checkID(req, res, next) {
    if (req.params) {
      return next();
    }
    return res.status(400).json({
      status: "Fail",
      message: "Invalid Params",
    });
  }

  checkQuery(req, res, next) {
    if (req.query) {
      return next();
    }
    return res.status(400).json({
      status: "Fail",
      message: "Invalid Query",
    });
  }

  async checkExistedVoted(req, res, next) {
    const uid = req.body.uid;
    const qid = req.query.question;

    const user = await UsersModel.findOne({ uid: uid });
    if (!user) {
      return next();
    }
    const existedVote = user.voted_questions.find(
      (question) => question.qid === qid
    );
    if (existedVote) {
      return res.status(403).json({
        status: "Fail",
        message: "User has already vote this question",
      });
    } else next();
  }

  async checkQuestionByParam(req, res, next) {
    const qid = req.params.id;

    const question = await QuestionsModel.findById(qid);
    if (question) {
      return next();
    }
    return res.status(404).json({
      message: `Question ${qid} is not found`,
    });
  }
}

module.exports = new Middlewares();
