const express = require("express");
const emailController = require("../components/emailController");

const errorHandler = require("../utils/errorHandling");
const router = express.Router();

router.post("/", emailController.validateEmailInput, emailController.Email);
router.use(errorHandler);
module.exports = router;
