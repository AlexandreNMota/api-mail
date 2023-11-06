const express = require("express");
const emailController = require("../components/emailController");
const router = express.Router();

router.post("/", emailController.validateEmailInput, emailController.Email);

module.exports = router;
