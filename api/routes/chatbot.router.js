const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbot.controller");
const isAuth = require("../middlewares/isAuth"); // Your authentication middleware

// Import custom multer configuration
const upload = require("../../util/multer");

// Define allowed MIME types (adjust as needed)
const allowedFileTypes = ["text/plain", "application/pdf"];

// POST /api/chatbot/process
// Expects a multipart/form-data request with a "query" field and an optional "file"
router.post(
  "/process",
  isAuth,
  upload("uploads", allowedFileTypes).single("file"),
  chatbotController.processChat
);

module.exports = router;
