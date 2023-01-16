const express = require("express");
const router = express.Router();
const middlewares = require("../middlewares/middlewares");
const OptionsController = require("../controllers/options.controller");

router
  .route("/")
  .post(
    middlewares.checkReqBody,
    middlewares.checkQuery,
    OptionsController.addOption
  );

router
  .route("/:id")
  .delete(
    middlewares.checkID,
    middlewares.checkQuery,
    OptionsController.deleteOption
  )
  .post(
    middlewares.checkID,
    middlewares.checkReqBody,
    OptionsController.addVote
  );

module.exports = router;
