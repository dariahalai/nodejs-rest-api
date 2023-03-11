const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const contactsList = async (req, res, next) => {
  const data = await listContacts();
  return res.status(200).json(data);
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await getContactById(contactId);
  return data
    ? res.status(200).json(data)
    : res.status(404).json({ message: "Not Found" });
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await removeContact(contactId);
  return data
    ? res.status(200).json({ message: "contact deleted" })
    : res.status(404).json({ message: "Not Found" });
};

const createContact = async (req, res, next) => {
  const value = req.value;
  const data = await addContact(value);
  return res.status(201).json(data);
};

const refreshContact = async (req, res, next) => {
  const { contactId } = req.params;
  const value = req.value;
  const data = await updateContact(contactId, value);
  return data
    ? res.status(200).json(data)
    : res.status(404).json({ message: "Not Found" });
};

module.exports = {
  contactsList,
  getContact,
  deleteContact,
  createContact,
  refreshContact,
};
