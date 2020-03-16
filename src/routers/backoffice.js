const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
const rest = require('../services/backoffice/rest')(router);

const unlessIsOptions = (middleware) => (req, res, next) => req.method === 'OPTIONS' ? next() : middleware(req, res, next);
router.use(unlessIsOptions(auth));
router.use(unlessIsOptions(admin));

rest.fromModel('User');
rest.fromModel('Mission');

module.exports = router;
