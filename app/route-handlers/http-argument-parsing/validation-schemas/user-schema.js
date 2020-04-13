const Joi = require('joi');

const userSchema = Joi.object().keys({
    email: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
});

module.exports = userSchema;
