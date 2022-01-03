const User = require('../../model/User');

const dummyUsers = async (req, res) => {
	try {
		const user = await new User({
			username: req.body.username,
			email: req.body.email,
		});

		await user.save();
		res.status(200).json('Ok');
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = dummyUsers;
