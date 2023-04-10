const Joi = require("joi");
const { userSubscription } = require("../models/users");

exports.userDataValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};
exports.updateUserSubscriptionValidator = (data) => {
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      subscription: Joi.string()
        .valid(...Object.values(userSubscription))
        .required(),
    })
    .validate(data);
};

exports.verifyUserEmailValidator = (data) =>
  Joi.object({
    email: Joi.string().email().required(),
  }).validate(data);
