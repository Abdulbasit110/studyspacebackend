const { body, param } = require("express-validator");
const { handleValidationErrors } = require("./handleValidationErrors");

module.exports = {
  // Validation middleware for creating a collection
  validateCreateCollection: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title must not exceed 100 characters"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .isLength({ max: 500 })
      .withMessage("Description must not exceed 500 characters"),

    body("visibility")
      .optional()
      .isIn(["public", "private"])
      .withMessage("Visibility must be either 'public' or 'private'"),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array of strings"),

    body("tags.*")
      .optional()
      .isString()
      .withMessage("Each tag must be a string")
      .isLength({ max: 50 })
      .withMessage("Each tag must not exceed 50 characters"),

    handleValidationErrors,
  ],

  // Validation middleware for updating a collection
  validateUpdateCollection: [
    param("id").isMongoId().withMessage("Invalid collection ID"),

    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty")
      .isLength({ max: 100 })
      .withMessage("Title must not exceed 100 characters"),

    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .isLength({ max: 500 })
      .withMessage("Description must not exceed 500 characters"),

    body("visibility")
      .optional()
      .isIn(["public", "private"])
      .withMessage("Visibility must be either 'public' or 'private'"),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array of strings"),

    body("tags.*")
      .optional()
      .isString()
      .withMessage("Each tag must be a string")
      .isLength({ max: 50 })
      .withMessage("Each tag must not exceed 50 characters"),

    handleValidationErrors,
  ],
};
