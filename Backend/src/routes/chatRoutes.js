const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { sendMessage } = require("../controller/chatController");
const historyCtrl = require("../controller/chatHistoryController");

router.post("/message", verifyToken, sendMessage);

router.get("/history", verifyToken, historyCtrl.list);
router.get("/history/:id", verifyToken, historyCtrl.getOne);
router.put("/history/:id", verifyToken, historyCtrl.update);
router.delete("/history/:id", verifyToken, historyCtrl.remove);

module.exports = router;
