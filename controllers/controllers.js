const Contacts = require("../models/contacts");

const contactsList = async (req, res) => {
  const data = await Contacts.find();

  res.status(200).json(data);
};

const getContact = async (req, res) => {
  const { contactId } = req.params;
  const data = await Contacts.findById(contactId);

  return res.status(200).json(data);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  await Contacts.findByIdAndRemove(contactId);

  return res.status(200).json({ message: "contact deleted" });
};

const createContact = async (req, res, next) => {
  const value = req.value;
  const { email, subscription } = req.user;
  const data = await Contacts.create({
    owner: { email, subscription },
    ...value,
  });

  return res.status(201).json(data);
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  const data = await Contacts.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  return res.status(200).json(data);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;

  const data = await Contacts.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  return res.status(200).json(data);
};

module.exports = {
  contactsList,
  getContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
