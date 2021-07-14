const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("config");

module.exports = async (req, res, next) => {
	const token = req.header("x-auth-token");

	try {
		const decodedUser = jwt.verify(token, config.get("secretKey"));

		const user = await User.findOne({
			_id: decodedUser._id,
			"tokens.token": token,
		});

		if (!user) {
			throw new Error();
		}

		req.token = token;
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: "User not found" });
	}
};
