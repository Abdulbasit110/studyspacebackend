const { body } = require("express-validator");
const { handleValidationErrors } = require("./handleValidationErrors");
const { rolesEnum } = require("../../util/enum");

module.exports = {
  // Validation middleware for login
  validateLogin: [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    handleValidationErrors,
  ],

  // Validation middleware for sign up
  validateSignUp: [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("firstName")
      .notEmpty().withMessage("First name is required")
      .isString().withMessage("First name must be a string"),
    body("lastName")
      .notEmpty().withMessage("Last name is required")
      .isString().withMessage("Last name must be a string"),
    body("location")
      .notEmpty().withMessage("Location is required"),
    body("address")
      .notEmpty().withMessage("Address is required"),
    body("phoneNumber")
      .notEmpty().withMessage("Phone number is required")
      .isMobilePhone().withMessage("Please provide a valid phone number"),
    body("role")
      .optional()
      .isIn(Object.values(rolesEnum)).withMessage(`Role must be one of: ${Object.values(rolesEnum).join(", ")}`),
    handleValidationErrors,
  ],
};
