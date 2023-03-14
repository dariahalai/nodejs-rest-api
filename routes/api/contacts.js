const express = require("express");
const {
  contactsList,
  getContact,
  createContact,
  deleteContact,
  refreshContact,
} = require("../../controllers/controllers");
const {
  toAddContactMiddlware,
  toUpdateContactMiddlware,
} = require("../../middlewares/middlewares");

const catchAsync = require("../../utils/catchAsync");

const router = express.Router();

router.get("/", catchAsync(contactsList));
router.post("/", toAddContactMiddlware, catchAsync(createContact));
router.put("/:contactId", toUpdateContactMiddlware, catchAsync(refreshContact));
router.get("/:contactId", catchAsync(getContact));
router.delete("/:contactId", catchAsync(deleteContact));

module.exports = router;
