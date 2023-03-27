const Joi = require("joi");
const { userSubscription } = require("../models/users");

exports.userDataValidator = (data) => {
  //   Joi.object()
  //     .options({ abortEarly: false })
  //     .keys({
  //       email: Joi.string().required(),
  //       password: Joi.string().required(),
  //     })
  //         .validate(data);

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
