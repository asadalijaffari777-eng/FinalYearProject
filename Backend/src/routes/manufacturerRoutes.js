const express = require("express");
const router = express.Router();

const { getManufacturers } = require("../controller/manufacturerController");

router.get("/", getManufacturers);

module.exports = router;