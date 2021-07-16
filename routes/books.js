const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const serverError = { msg: "Internal Server Error" };
const multer = require("multer");

//Get All Books
router.get("/books", async (req, res) => {
	try {
		const books = await Book.find();

		const updatedBooks = books.map((book) => {
			return book.removeOwnerProp();
		});

		res.status(200).json({ books: updatedBooks });
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

//Get User Specific books
router.get("/books/me", auth, async (req, res) => {
	try {
		const books = await Book.find({ owner: req.user._id });
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
			owner: req.user._id,
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
		let book = await Book.findById({ _id: id, owner: req.user._id });

		if (!book) {
			return res.status(404).json({ error: "Book does not exist" });
		}

		if (req.user._id.toString() !== book.owner.toString()) {
			return res.status(400).json({ err: "Cannot update book." });
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
		const book = await Book.findOne({ _id: id, owner: req.user._id });

		if (!book) {
			return res.status(400).send({ error: "Book does not exist" });
		}

		if (req.user._id.toString() !== book.owner.toString()) {
			return res.status(400).json({ err: "Cannot Delete Book" });
		}

		await book.remove();
		res.status(200).json(book);
	} catch (error) {
		console.log(error);
		res.status(500).send(serverError);
	}
});

const uploadImage = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.endsWith(".jpg")) {
			return cb(new Error("Please provide the right file"));
		}

		cb(undefined, true);
	},
});

//Add Book Image
router.post(
	"/books/:id/image",
	auth,
	uploadImage.single("upload"),
	async (req, res) => {
		const _id = req.params.id;
		try {
			const book = await Book.findById(_id);

			if (book.bookImage) {
				return res.status(400).json({ err: "Image already exists" });
			}

			book.bookImage = req.file.buffer;

			await book.save();

			res.json(book);
		} catch (error) {
			console.log(error);
			res.status(500).send();
		}
	},
);
module.exports = router;
