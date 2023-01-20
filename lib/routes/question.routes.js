const express = require("express");
const router = express.Router();
const QuestionController = require("../controllers/questions.controller");
const middlewares = require("../middlewares/middlewares");

router
  .route("/")
  .get(QuestionController.getQuestions)
  .post(middlewares.checkReqBody, QuestionController.createQuestion);

router
  .route("/:id")
  .delete(middlewares.checkID, QuestionController.deleteQuestion)
  .patch(
    middlewares.checkID,
    middlewares.checkReqBody,
    QuestionController.editQuestion
  );

router.route("/trending").get(QuestionController.getTrendingQuestions);

module.exports = router;
