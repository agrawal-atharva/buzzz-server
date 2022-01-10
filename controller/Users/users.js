const User = require('../../model/User');

const addFriend = async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (
				!currentUser.friends.includes(req.params.id) &&
				!currentUser.requestSent.includes(req.body.userId)
			) {
				await user.updateOne({
					$push: {
						notification: [req.body.userId],
					},
				});
				await currentUser.updateOne({ $push: { requestSent: req.params.id } });
				res.status(200).json(user);
			} else {
				res.status(403).json('You are already friends');
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json('You cannot add yourself');
	}
};

const removeFriend = async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.friends.includes(req.body.userId)) {
				await user.updateOne({ $pull: { friends: req.body.userId } });
				await currentUser.updateOne({ $pull: { friends: req.params.id } });
				res.status(200).json('Unfriended');
			} else {
				res.status(403).json('Not friend with this user');
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json('You cannot unfriend yourself');
	}
};

const updateUser = async (req, res) => {
	if (req.body.userId === req.params.userId) {
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json('User updated');
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json('You can only update your account');
	}
};

const deleteUser = async (req, res) => {
	if (req.body.userId === req.params.userId) {
		try {
			const user = await User.findByIdAndDelete(req.params.id);
			res.status(200).json('User deleted');
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json('You can delete only your account');
	}
};

const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

const suggestionUsers = async (req, res) => {
	try {
		const suggestions = await User.find({
			_id: { $ne: req.params.id },
			friends: { $ne: req.params.id },
		});
		res.status(200).json(suggestions);
	} catch (err) {
		res.status(500).json(err);
	}
};

const currentUser = async (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (err) {
		res.status(500).json(err);
	}
};

const contactUser = async (req, res) => {
	try {
		const id = req.user._id;
		const user = await User.findById(id).populate('friends');
		const userList = user.friends.map((item) => {
			return {
				name: item.username,
				id: item._id,
				pic: item.profilePicture,
			};
		});
		res.status(200).json(userList);
	} catch (err) {
		res.status(500).json(err);
	}
};

const showAllFriendRequest = async (req, res) => {
	try {
		const currentUser = await User.findById(req.params.id).populate(
			'notification'
		);
		console.log('CUI', currentUser);
		const currentUserRequest = currentUser.notification.map((users) => {
			console.log('users::', users);
			return {
				id: users._id,
				name: users.username,
				profilePic: users.profilePicture,
			};
		});
		console.log('CUR', currentUserRequest);
		res.status(200).json(currentUserRequest);
	} catch (err) {
		res.status(500).json(err);
	}
};

const acceptRequest = async (req, res) => {
	const currentUser = await User.findById(req.params.id);
	const acceptRequest = currentUser.notification.map();
};

module.exports = {
	addFriend,
	removeFriend,
	updateUser,
	deleteUser,
	getUser,
	suggestionUsers,
	currentUser,
	contactUser,
	showAllFriendRequest,
};
