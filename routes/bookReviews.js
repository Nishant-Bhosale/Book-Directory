const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const BookReview = require("../models/BookReview");
const multer = require("multer");

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

		res.status(201).json(bookReview);
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

//Edit Review
router.put("/books/review/:id", auth, async (req, res) => {
	const _id = req.params.id;
	const { review } = req.body;
	const filter = {
		for: _id,
		reviewBy: req.user.name,
	};

	try {
		const reviewToUpdate = await BookReview.find(filter);

		if (!reviewToUpdate) {
			return res.status(404).json({ msg: "Please add a review first" });
		}

		const updatedReview = await BookReview.updateOne(filter, {
			review: review,
		});

		res.status(200).send({ msg: "Review Updated" });
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

module.exports = router;
