const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const serverError = { msg: "Internal Server Error" };

//Get All books
router.get("/books", async (req, res) => {
	try {
		const books = await Book.find();
		res.status(200).json(books);
	} catch (error) {
		console.log(error);
		res.status(500).send(serverError);
	}
});

//Add new Book
router.post("/books", auth, async (req, res) => {
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

		res.status(201).json(book);
	} catch (error) {
		console.log(error);
		res.status(500).send(serverError);
	}
});

//Update Existing Book
router.put("/books/:id", auth, async (req, res) => {
	const id = req.params.id;
	const { name, author, publisher, price } = req.body;
	try {
		let book = await Book.findById(id);

		if (!book) {
			return res.status(404).json({ error: "Book does not exist" });
		}

		let newBook = {};

		if (name) newBook.name = name;
		if (author) newBook.author = author;
		if (publisher) newBook.publisher = publisher;
		if (price) newBook.price = price;

		book = await Book.findByIdAndUpdate(id, { $set: newBook }, { new: true });
		res.status(201).json(book);
		console.log(book);
	} catch (error) {
		console.log(error);
		res.status(500).send(serverError);
	}
});

//Delete a book
router.delete("/books/:id", auth, async (req, res) => {
	const id = req.params.id;

	try {
		const book = await Book.findById(id);

		if (!book) {
			return res.status(400).send({ error: "Book does not exist" });
		}

		await book.remove();
		res.status(200).json(book);
	} catch (error) {
		console.log(error);
		res.status(500).send(serverError);
	}
});
module.exports = router;
