const { body } = require("express-validator");
const { handleValidationErrors } = require("./handleValidationErrors");

module.exports = {
  // Validation middleware for login
  validateLogin: [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please provide a valid email"),
    body("password")
      .optional() // Optional for Google login
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("googleId").optional().isString().withMessage("Google ID must be a string"),
    handleValidationErrors,
  ],

  // Validation middleware for sign up
  validateSignUp: [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please provide a valid email"),
    body("password")
      .optional() // Optional for Google signup
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("googleId").optional().isString().withMessage("Google ID must be a string"),
    body("firstName")
      .optional()
      .isString().withMessage("First name must be a string"),
    body("lastName")
      .optional()
      .isString().withMessage("Last name must be a string"),
    handleValidationErrors,
  ],
};
