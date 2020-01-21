const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const userService = require('../services/user/user');
const missionService = require('../services/user/mission');

router.post('/register', userService.createUser);

router.post('/login', userService.login);

router.post('/me', auth, userService.me);

router.post('/edit', auth, userService.edit);

router.post('/logout', auth, userService.logout);

router.post('/logoutAll', auth, userService.logoutall);

router.post('/modifyEmail', auth, userService.modifyEmail);

router.post('/modifyPhone', auth, userService.modifyPhone);

router.get('/user/:_id', userService.getUser);

router.post('/createmission', auth, missionService.createMission);

router.post('/getMission', auth, missionService.getMission);

router.post('/forgot', userService.forgot);

router.post('/reset', userService.reset);

router.post('/validEmail', userService.validEmail)

router.post('/modifyPassword', auth, userService.modifyPassword);
module.exports = router;

