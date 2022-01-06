const User = require('../../model/User');
const FriendRequest = require('../../model/FriendRequest');

const addFriend = async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.friends.includes(req.body.userId)) {
				// try {
				// 	const friendRequest = await new FriendRequest({
				// 		requester: req.body.userId,
				// 		recipient: req.params.id,
				// 		status: '',
				// 	});
				// } catch (err) {
				// 	res.status(500).json(err);
				// }

				await user.updateOne({
					$push: {
						friends: [req.body.userId],
					},
				});
				await currentUser.updateOne({ $push: { friends: req.params.id } });
				res.status(200).json('Request sent');
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
		// console.log('First');
		// const suggestions = await User.find({ _id: { $ne: [req.params.id] } });
		// const currentUser = await User.findById(req.params.id);
		// console.log('Current user', currentUser);
		// console.log('Suggestions', suggestions);
		const suggestions = await User.find({
			_id: { $ne: req.params.id },
			friends: { $ne: req.params.id },
		});
		console.log('Suggestion', suggestions);
		res.status(200).json(suggestions);
	} catch (err) {
		res.status(500).json(err);
	}
};

const currentUser = async (req, res) => {
	try {
		// const currentUser = await User.find(req.user);
		res.status(200).json(req.user);
	} catch (err) {
		res.status(500).json(err);
	}
};

const contactUser = async (req, res) => {
	try {
		const id = req.user._id;
		console.log('ID::', id);
		// console.log('PARAMS', (id = req.user._id));
		const user = await User.findById(id).populate('friends');
		console.log('User::', user);
		const userList = user.friends.map((item) => {
			return {
				name: item.username,
				id: item._id,
				pic: item.profilePicture,
			};
		});
		console.log('User list', userList);
		res.status(200).json(userList);
	} catch (err) {
		res.status(500).json(err);
	}
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
};
