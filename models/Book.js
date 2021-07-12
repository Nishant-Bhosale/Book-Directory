const mongoose = require("mongoose");
const { Schema } = mongoose;

const Book = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	author: {
		type: String,
		required: true,
	},
	publisher: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model("Book", Book);
