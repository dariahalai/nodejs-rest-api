const fs = require("fs").promises;
const path = require("path");

const uuid = require("uuid").v4;
const contactsPath = path.join(__dirname, "contacts.json");

const getParseContactsPath = async (path) => {
  const data = await fs.readFile(path, "utf-8");
  return JSON.parse(data);
};

const listContacts = async () => {
  const data = await getParseContactsPath(contactsPath);
  return data;
};

const getContactById = async (contactId) => {
  if (!contactId) {
    return;
  }
  const data = await listContacts();
  const findIndexId = data.findIndex((item) => item.id === contactId);
  return data[findIndexId];
};

const removeContact = async (contactId) => {
  if (!contactId) {
    return;
  }
  const data = await listContacts();
  const findIndexId = data.findIndex((item) => item.id === contactId);
  if (findIndexId === -1) {
    return;
  }
  const removedContact = data[findIndexId];
  data.splice(findIndexId, 1);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return removedContact;
};

const addContact = async (body) => {
  const data = await listContacts();
  const newContact = {
    id: uuid(),
    ...body,
  };
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return newContact;
};

const updateContact = async (contactId, body) => {
  if (!contactId || !body) {
    return;
  }
  const data = await listContacts();
  const findIndexId = data.findIndex((item) => item.id === contactId);
  if (findIndexId === -1) {
    return;
  }
  data[findIndexId] = { ...data[findIndexId], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return data[findIndexId];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  getParseContactsPath,
};
