const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

//Get All Users
router.get("/users", async (req, res) => {
	try {
		const users = await User.find({});

		res.json(users).status(200);
	} catch (error) {
		console.log(error);

		res.status(500).send();
	}
});

//Sign Up Route
router.post("/users", async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ error: "Email Already Exists" });
		}

		const newUser = new User({ ...req.body });

		const token = await newUser.generateAuthToken();

		res.status(201).json({ newUser, token });
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

//Login Route
router.post("/users/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findByCredentials(email, password);

		const token = await user.generateAuthToken();

		res.status(200).json({ user, token });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

//Logout Route
router.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token != req.token;
		});

		await req.user.save();
		res.status(200).send();
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

//Logout All
router.post("/users/logoutAll", auth, async (req, res) => {
	try {
		req.user.tokens = [];

		await req.user.save();

		res.status(200).send();
	} catch (error) {
		console.log(error);
		res.status(500).send();
	}
});

module.exports = router;
