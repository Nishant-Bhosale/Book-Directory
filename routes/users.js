const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/users", async (req, res) => {
	console.log("Users");
});

module.exports = router;
