const express = require("express");
const router = express.Router();

const interestController = require("../controllers/interestController");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(authController.protect, interestController.createInterest)
  .get(authController.protect, interestController.getInterest);

router.route("/:interestId").patch(interestController.updateInterest);

module.exports = router;
