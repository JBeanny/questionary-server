const express = require("express");
const router = express.Router();
const middlewares = require("../middlewares/middlewares");
const OptionsController = require("../controllers/options.controller");
const asyncHandler = require("../helper/ErrorHandler");

router
  .route("/")
  .post(
    middlewares.checkReqBody,
    middlewares.checkQuery,
    asyncHandler(OptionsController.addOption)
  );

router
  .route("/:id")
  .delete(
    middlewares.checkID,
    middlewares.checkQuery,
    asyncHandler(OptionsController.deleteOption)
  )
  .post(
    middlewares.checkID,
    middlewares.checkReqBody,
    middlewares.checkExistedVoted,
    asyncHandler(OptionsController.addVote)
  );

module.exports = router;
