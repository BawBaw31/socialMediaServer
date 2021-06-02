const router = require('express').Router();
const verify = require('../middlewares/verifySession');
const Post = require('../models/Post');
const User = require('../models/User');

// get wall
router.get('/:userName', verify, async(req,res,next) => {
    const wallUser = await User.findOne({name: req.params.userName});

    if (res.locals.user && wallUser){
        const user = await User.findOne({_id: res.locals.user._id});
        const wallPosts = await Post.find({autorName: wallUser.name}).sort({date: -1});
        res.rawStatus = 200;
        res.rawResponse = [wallPosts, user];
    } else {
        res.rawStatus = 400
        res.rawResponse = (['Access denied !']);
    }
    next();
});

// is friend
router.post('/is-friend', verify, async(req, res, next) => {
    if (res.locals.user) {
        const user = await User.findOne({_id: res.locals.user._id});
        if (user.friends.includes(req.body.friendName)) {
            res.rawStatus = 200;
            res.rawResponse = [true];
        } else {
            res.rawStatus = 200;
            res.rawResponse = [false];
        }
    } else {
        res.rawStatus = 400
        res.rawResponse = (['Access denied !']);
    }
    next();
})

module.exports = router;