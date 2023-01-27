const express = require("express");
const router = express.Router();
const QuestionController = require("../controllers/questions.controller");
const middlewares = require("../middlewares/middlewares");
const asyncHandler = require("../helper/ErrorHandler");

router
  .route("/")
  .get(asyncHandler(QuestionController.getQuestions))
  .post(
    middlewares.checkReqBody,
    asyncHandler(QuestionController.createQuestion)
  );

router
  .route("/:id")
  .delete(middlewares.checkID, asyncHandler(QuestionController.deleteQuestion))
  .patch(
    middlewares.checkID,
    middlewares.checkReqBody,
    middlewares.checkQuestionByParam,
    asyncHandler(QuestionController.editQuestion)
  );

router
  .route("/trending")
  .get(asyncHandler(QuestionController.getTrendingQuestions));

module.exports = router;
