const router = require('express').Router();
const verify = require('../middlewares/verifySession');
const Post = require('../models/Post');
const User = require('../models/User');

// Getting friends news
router.get('/news', verify, async(req,res,next) => {
    if (res.locals.user){
        const user = await User.findOne({_id: res.locals.user._id});
        const news =  await Post.find(
            user.friends.forEach(friend => {autorName: friend})
            ).sort({date: -1});
        res.rawStatus = 200;
        res.rawResponse = [news, user];
    } else {
        res.rawStatus = 400
        res.rawResponse = (['Access denied !']);
    }
    next();
});

// Getting my profile
router.get('/profile', verify, async(req,res,next) => {
    if (res.locals.user){
        const user = await User.findOne({_id: res.locals.user._id});
        const posts = await Post.find({autorName: user.name}).sort({date: -1});
        res.rawStatus = 200;
        res.rawResponse = [posts, user];
    } else {
        res.rawStatus = 400
        res.rawResponse = (['Access denied !']);
    }
    next();
});

// Creating a new post
router.post('/create', verify, async(req,res,next) => {
    const user = res.locals.user;
    if (user && req.body.text) {
        console.log(user);
        // Validate
    
        // Create new post
        const post = new Post({
            autorName: user.name,
            text: req.body.text
        });
    
        try {
            await post.save();
            res.rawStatus = 200;
            res.rawResponse = ['Posted !'];
        }catch(err){
            res.rawStatus = 400;
            res.rawResponse = [err];
        }

    } else {
        res.rawStatus = 400;
        res.rawResponse = ['Post failed !'];
    }
    next();
});

// Adding friend
router.post('/add-friend', verify, async(req,res,next) => {
    const user = res.locals.user;
    if (user && req.body.friend) {
        // Validate

        // Add the friend
        try {
            await User.updateOne(
                { _id: user._id },
                { $addToSet: { friends: req.body.friend } }
            );
            res.rawStatus = 200;
            res.rawResponse = [`You just followed ${req.body.friend} !`];
        } catch(err) {
            res.rawStatus = 400;
            res.rawResponse = [err];
        }

    } else {
        res.rawStatus = 400;
        res.rawResponse = ['Follow request failed !'];
    }
    next();
});

// Deleting friend
router.post('/delete-friend', verify, async(req,res,next) => {
    const user = res.locals.user;
    if (user && req.body.friend) {
        // Validate

        // Delete the friend
        try {
            await User.updateOne(
                { _id: user._id },
                { $pull: { friends: req.body.friend } }
            );
            res.rawStatus = 200;
            res.rawResponse = [`You don't follow ${req.body.friend} anymore !`];
        } catch(err) {
            res.rawStatus = 400;
            res.rawResponse = [err];
        }

    } else {
        res.rawStatus = 400;
        res.rawResponse = ['Unfollow request failed !'];
    }
    next();
});

module.exports = router;