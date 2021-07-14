const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
const config = require("config");

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minLength: 7,
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

UserSchema.methods.getPublicProfile = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

UserSchema.methods.generateAuthToken = async function () {
	const user = this;

	const payload = { _id: user.id };

	const token = jwt.sign(payload, config.get("secretKey"));

	user.tokens = user.tokens.concat({ token });

	await user.save();

	return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("User does not exist.");
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error("Password does not match.");
	}

	return user;
};

UserSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		const hashedPassword = await bcrypt.hash(user.password, 9);
		user.password = hashedPassword;
	}

	next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
