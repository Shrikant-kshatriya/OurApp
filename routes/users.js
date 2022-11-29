const express = require('express');
const { registerUser, loginUser, logoutUser, renderProfile, followUser, unfollowUser, renderProfileFollower, renderProfileFollowing } = require('../controller/userController');
const router = express.Router();
const passport = require('passport');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/:username', renderProfile);
router.post('/follow/:username', followUser);
router.delete('/follow/:username', unfollowUser);
router.get('/:username/follower', renderProfileFollower);
router.get('/:username/following', renderProfileFollowing);

module.exports = router;