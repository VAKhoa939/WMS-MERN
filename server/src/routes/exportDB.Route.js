const express = require("express");
const exportController = require("../controllers/exportDB.Controller");

const router = express.Router();

router.get("/export", exportController.exportDB);

module.exports = router;
