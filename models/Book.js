const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
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
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
});

bookSchema.methods.removeOwnerProp = function () {
	const book = this;
	const bookObject = book.toObject();

	delete bookObject.owner;

	return bookObject;
};

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
