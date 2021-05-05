const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        verifPassword: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

// Reset password validation
const resetPasswordValidation = (data) => {
    const schema = Joi.object({
        password: Joi.string().min(6).required(),
        verifPassword: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.resetPasswordValidation = resetPasswordValidation;