const importController = require("../controllers/importDB.Controller");
const multer = require("multer");
const router = require("express").Router();

const upload = multer({ dest: "uploads/" });

router.post("/import", upload.single("file"), importController.importCSV);

module.exports = router;
