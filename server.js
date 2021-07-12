const express = require("express");
const port = 5000 || process.env.PORT;
const app = express();
const mongoose = require("mongoose");

app.listen(port, () => {
	console.log(`Port is running on ${port}`);
});
