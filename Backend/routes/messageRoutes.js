const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/view/:groupId", messageController.getChatHistory);
router.post("/send", messageController.saveMessage);

module.exports = router;