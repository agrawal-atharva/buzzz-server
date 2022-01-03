const express = require('express');
const dummyUsers = require('../../controller/Users/dummyUsers');

const router = express.Router();

router.post('/', dummyUsers);

module.exports = router;
