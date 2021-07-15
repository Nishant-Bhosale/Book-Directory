const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookReviewSchema = new Schema({
	review: {
		type: String,
		maxLength: 125,
	},
	for: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Book",
	},
	reviewBy: {
		type: String,
		required: true,
	},
});

const BookReview = mongoose.model("BookReview", bookReviewSchema);

module.exports = BookReview;
