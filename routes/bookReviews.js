const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const Book = require("../models/Book");
const BookReview = require("../models/BookReview");

//Add new Review
router.post("/books/review/:id", auth, async (req, res) => {
	const _id = req.params.id;
	const { review } = req.body;

	try {
		const bookReview = new BookReview({
			review,
			for: _id,
			reviewBy: req.user.name,
		});

		await bookReview.save();
		console.log(bookReview);
		res.status(201).send(bookReview);
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

module.exports = router;
