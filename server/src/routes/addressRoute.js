// routes/addressRoutes.js
const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const middlewareController = require("../middleware/middleware");

router.post(
  "/",
  middlewareController.verifyToken,
  addressController.createAddress
);
router.get(
  "/",
  middlewareController.verifyToken,
  addressController.getAllAddresses
);
router.get(
  "/:id",
  middlewareController.verifyToken,
  addressController.getAddressById
);
router.put(
  "/:id",
  middlewareController.verifyToken,
  addressController.updateAddress
);
router.delete(
  "/:id",
  middlewareController.verifyToken,
  addressController.deleteAddress
);

module.exports = router;
