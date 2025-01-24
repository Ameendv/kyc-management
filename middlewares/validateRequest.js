const CustomError = require("../utils/customError");

module.exports = validateRequest;

function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        const validationErrorMessage = error.details.map(x => x.message).join(', ');
        return next(new CustomError(validationErrorMessage, 400));
    } else {
        req.body = value;
        next();
    }
}