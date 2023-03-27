const express = require("express");
const {
  contactsList,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/controllers");
const { protect } = require("../../middlewares/authMiddlewares");
const {
  checkCreateContactData,
  checkUpdateContactData,
  checkUpdateFavoriteContact,
  checkContactId,
} = require("../../middlewares/middlewares");

const catchAsync = require("../../utils/catchAsync");

const router = express.Router();

router.use(protect);

router.get("/", catchAsync(contactsList));
router.post("/", checkCreateContactData, catchAsync(createContact));

router.put(
  "/:contactId",
  checkContactId,
  checkUpdateContactData,
  catchAsync(updateContact)
);
router.get("/:contactId", checkContactId, catchAsync(getContact));
router.delete("/:contactId", checkContactId, catchAsync(deleteContact));
router.patch(
  "/:contactId/favorite",
  checkContactId,
  checkUpdateFavoriteContact,
  catchAsync(updateStatusContact)
);

module.exports = router;
