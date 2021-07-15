const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const BookReview = require("../models/BookReview");

//Get Reviews
router.get("/books/review/:id", auth, async (req, res) => {
	const _id = req.params.id;

	try {
		const reviews = await BookReview.find({ for: _id });

		if (reviews.length <= 0) {
			return res.status(400).json({ msg: "No Reviews exist" });
		}

		res.status(200).json(reviews);
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

//Add new Review
router.post("/books/review/:id", auth, async (req, res) => {
	const _id = req.params.id;
	const { review } = req.body;

	try {
		const checkBookReview = await BookReview.findOne({
			for: _id,
			reviewBy: req.user.name,
		});

		console.log(checkBookReview);

		if (checkBookReview) {
			return res
				.status(400)
				.json({ msg: "Cannot post review more than one time." });
		}

		const bookReview = new BookReview({
			review,
			for: _id,
			reviewBy: req.user.name,
		});

		await bookReview.save();

		res.status(201).send(bookReview);
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

module.exports = router;
