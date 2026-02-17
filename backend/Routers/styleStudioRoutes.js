const express = require("express");
const router = express.Router();
const styleStudioController = require("../Controllers/styleStudioController");

router.post("/generate", styleStudioController.generateStyleImage);
router.post("/search", styleStudioController.searchByPrompt);

module.exports = router;
