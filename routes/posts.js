const router = require('express').Router();
const verify = require('../middlewares/verifySession');

router.get('/', verify, (req,res,next) => {
    if (res.locals.user){
        res.rawStatus = 200;
        res.rawResponse = res.locals.user;
    }
    next();
});

module.exports = router;