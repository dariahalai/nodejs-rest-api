const Joi = require("joi");

exports.dataAddContactValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .messages({ "any.required": `missing required name field` }),
    email: Joi.string()
      .required()
      .messages({ "any.required": `missing required email field` }),
    phone: Joi.number()
      .required()
      .messages({ "any.required": `missing required phone field` }),
  });
  return schema.validate(data);
};

exports.dataUpdateContactValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.number().optional(),
  }).or("name", "email", "phone");
  return schema.validate(data);
};
