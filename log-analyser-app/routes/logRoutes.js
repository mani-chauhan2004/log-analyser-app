const express = require("express");
const upload = require("../config/multerConfig");
const { uploadLogs, searchLogs } = require("../controllers/logController");
const { processLogs } = require("../controllers/processingController");

const router = express.Router(); // creating the router instance of the express router class

router.post("/upload", upload.array("logFiles", 10), uploadLogs); // upload log files

router.get("/search", searchLogs); // search log files

router.get("/process", processLogs); // process log files

module.exports = router;
