const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    next();
};

module.exports = { handleValidationErrors };
