const { Types } = require("mongoose");
const Contacts = require("../models/contacts");
const catchAsync = require("../utils/catchAsync");

const {
  createContactDataValidator,
  updateContactDataValidator,
  updateFavoriteContactValidator,
} = require("../utils/contactValidator");

exports.checkCreateContactData = catchAsync(async (req, res, next) => {
  const { error, value } = createContactDataValidator(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const contactExists = await Contacts.exists({ email: value.email });
  if (contactExists)
    return res
      .status(409)
      .json({ message: "Contact with this email already exists..." });

  req.value = value;
  next();
});

exports.checkUpdateContactData = catchAsync(async (req, res, next) => {
  const { error, value } = updateContactDataValidator(req.body);
  if (error) return res.status(400).json({ message: "missing fields" });

  const contactExists = await Contacts.exists({ email: value.email });
  if (contactExists)
    return res
      .status(409)
      .json({ message: "Contact with this email already exists..." });

  req.body = value;
  next();
});

exports.checkUpdateFavoriteContact = catchAsync(async (req, res, next) => {
  const { error, value } = updateFavoriteContactValidator(req.body);
  if (error) return res.status(400).json({ message: "missing field favorite" });

  req.body = value;
  next();
});

exports.checkContactId = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;

  const idIsValid = Types.ObjectId.isValid(contactId);
  if (!idIsValid) return res.status(404).json({ message: "Not Found" });

  next();
});
