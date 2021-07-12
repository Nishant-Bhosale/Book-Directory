const express = require("express");
const port = 5000 || process.env.PORT;
const app = express();
const mongoose = require("mongoose");
const Book = require("./models/Book");

app.get("/", async (req, res) => {
	res.send("Hello Word");
});

app.listen(port, () => {
	console.log(`Port is running on ${port}`);
});
