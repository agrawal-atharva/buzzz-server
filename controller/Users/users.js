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
		const currentUserRequest = currentUser.notification.map((users) => {
			return {
				id: users._id,
				name: users.username,
				profilePic: users.profilePicture,
				friends: users.friends,
			};
		});
		res.status(200).json(currentUserRequest);
	} catch (err) {
		res.status(500).json(err);
	}
};

const acceptRequest = async (req, res) => {
	try {
		const toAcceptUserId = req.body.acceptUserId;
		const currentUser = await User.findById(req.params.id);
		const toAcceptUser = await User.findById(toAcceptUserId);
		if (
			!currentUser.friends.includes(toAcceptUserId) &&
			!toAcceptUser.friends.includes(req.params.id)
		) {
			await currentUser.updateOne({
				$push: { friends: toAcceptUserId },
				$pull: { notification: toAcceptUserId },
			});
			await toAcceptUser.updateOne({
				$push: { friends: req.params.id },
				$pull: { requestSent: req.params.id },
			});
		}
		const result = [currentUser, toAcceptUser];
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json(err);
	}
};

const rejectRequest = async (req, res) => {
	try {
		const toRejectUserId = req.body.rejectUserId;
		const currentUser = await User.findById(req.params.id);
		const toRejectUser = await User.findById(toRejectUserId);
		const rejectRequestCurrentUser = await currentUser.update({
			$pull: { notification: toRejectUserId },
		});
		const rejectRequestNotifUser = await toRejectUser.update({
			$pull: { requestSent: req.params.id },
		});
		const result = [currentUser, toRejectUser];
		res.status(200).json(result);
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
	showAllFriendRequest,
	acceptRequest,
	rejectRequest,
};
