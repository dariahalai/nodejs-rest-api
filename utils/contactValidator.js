const Joi = require("joi");

exports.createContactDataValidator = (data) => {
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
    favorite: Joi.boolean(),
  });
  return schema.validate(data);
};

exports.updateContactDataValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.number().optional(),
  }).or("name", "email", "phone");
  return schema.validate(data);
};

exports.updateFavoriteContactValidator = (data) => {
  const schema = Joi.object({
    favorite: Joi.boolean()
      .required()
      .messages({ "any.required": `missing field favorite` }),
  });
  return schema.validate(data);
};
