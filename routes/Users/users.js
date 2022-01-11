const express = require('express');
const {
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
} = require('../../controller/Users/users');

const router = express.Router();

//current user
router.get('/current', currentUser);
//update user
router.put('/:id', updateUser);
//delete user
router.delete('/:id', deleteUser);
//get a user
router.get('/:id', getUser);
//add friend
router.put('/:id/add/friend', addFriend);
//remove friend
router.put('/:id/remove/friend', removeFriend);
//get user for suggestions
router.get('/:id/suggestions', suggestionUsers);
//contact user
router.get('/contacts/:id', contactUser);
//show all request
router.get('/:id/showRequest', showAllFriendRequest);
//accept friend request
router.put('/:id/accept', acceptRequest);
//reject request
router.put('/:id/reject', rejectRequest);

module.exports = router;
