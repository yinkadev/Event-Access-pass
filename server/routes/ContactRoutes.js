
const express = require("express");
const router = express.Router();

const {
  submitContactMessage,
} = require("../Controller/ContactController");

router.post("/", submitContactMessage);

module.exports = router;
