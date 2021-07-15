const express = require("express");
const port = 5000 || process.env.PORT;
const connectDB = require("./config/db");
const app = express();
const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");
const bookReviewRouter = require("./routes/bookReviews");
app.use(express.json({ extended: false }));
app.use(booksRouter);
app.use(usersRouter);
app.use(bookReviewRouter);

connectDB();

app.get("/", async (req, res) => {
	res.send("Hello Word");
});

app.listen(port, () => {
	console.log(`Port is running on ${port}`);
});
