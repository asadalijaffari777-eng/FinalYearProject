const express = require("express");
const router = express.Router();

const { getItems } = require("../controller/itemController");

router.get("/", getItems);

module.exports = router;
