'use strict';

const Joi = require('joi');

const { Success, Failure } = require('data.validation');

const joiAdapter = async (obj, schema) => {
    const validationResult = await Joi.validate(obj, schema, {stripUnknown: { objects: true }, abortEarly: false});

    if (validationResult.error) {
        return Failure(validationResult);
    } else {
        return Success(validationResult.value);
    }
};

module.exports = (reqData, schemaName) => {
    const schemaObj = require(`./validation-schemas`)[schemaName];
    return joiAdapter(reqData, schemaObj);
};
