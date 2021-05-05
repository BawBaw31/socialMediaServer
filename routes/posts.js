const router = require('express').Router();
const User = require('../models/User');
const verify = require('../middlewares/verifySession');

router.get('/', verify, (req,res,next) => {
    console.log('log');
    res.rawResponse = res.locals.user;
    next();
});

module.exports = router;