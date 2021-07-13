const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/users", async (req, res) => {
	try {
		const users = await User.find({});

		res.json(users).status(200);
	} catch (error) {
		console.log(error);

		res.status(500).send();
	}
});

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

module.exports = router;
