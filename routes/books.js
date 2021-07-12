const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

const serverError = { msg: "Internal Server Error" };

router.get("/books", async (req, res) => {
	try {
		const books = await Book.find();
		res.status(200).json(books);
	} catch (error) {
		console.log(error);
		res.status(500).send(serverError);
	}
});

router.post("/books", async (req, res) => {
	// console.log(req.body);
	const { name } = req.body;
	try {
		const sameBook = await Book.findOne({ name });

		if (sameBook) {
			return res.status(400).send({ error: "Book already exists." });
		}

		const book = new Book({
			...req.body,
		});

		await book.save();
	} catch (error) {
		console.log(error);
		res.status(500).send(serverError);
	}
});

router.put("/books/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const book = await Book.findById(id);

		if (!book) {
			return res.status(404).json({ error: "Book does not exist" });
		}

		console.log(book);
	} catch (error) {
		console.log(error);
		res.status(500).send(serverError);
	}
});
module.exports = router;
