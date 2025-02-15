const createErrorResponse = (res, error) => {
    console.error('Error details:', error);

    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            code: 400,
            error: 'ValidationError',
            message: 'Validation failed.',
            validationErrors: Object.values(error.errors).map(err => ({
                path: err.path,
                message: err.message,
            })),
        });
    }

    // Handle Mongoose Cast Errors (invalid ObjectId)
    if (error.kind === 'ObjectId') {
        return res.status(400).json({
            code: 400,
            error: 'InvalidObjectId',
            message: 'The provided ID is invalid.',
        });
    }

    // Handle Mongoose Duplicate Key Errors
    if (error.code === 11000) {
        return res.status(409).json({
            code: 409,
            error: 'DuplicateKeyError',
            message: 'A resource with that identifier already exists.',
            fields: error.keyValue,
        });
    }

    // Handle Not Found Errors
    if (error.name === 'DocumentNotFoundError') {
        return res.status(404).json({
            code: 404,
            error: 'NotFound',
            message: 'Resource not found.',
        });
    }

    // Handle Unauthorized Errors
    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            code: 401,
            error: 'Unauthorized',
            message: 'Authentication is required.',
        });
    }

    // Handle Forbidden Errors
    if (error.name === 'ForbiddenError') {
        return res.status(403).json({
            code: 403,
            error: 'Forbidden',
            message: 'You do not have permission to perform this action.',
        });
    }

    // Handle other unexpected errors
    return res.status(500).json({
        code: 500,
        error: 'InternalServerError',
        message: 'An unexpected error occurred.',
    });
};

module.exports = {
    createErrorResponse,
};
