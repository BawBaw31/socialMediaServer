const router = require('express').Router();
const verify = require('../middlewares/verifySession');
const Post = require('../models/Post');
const User = require('../models/User');

// Getting friends news
router.get('/news', verify, async(req,res,next) => {
    if (res.locals.user){
        const user = await User.findOne({_id: res.locals.user._id});
        const news = await Post.find({autorName : { $in : user.friends}})
            .sort({date: -1});
        // const news =  await Post.find(
        //     user.friends.forEach(friend => {autorName: friend})
        //     ).sort({date: -1});
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

// Deleting a post
router.post('/delete', verify, async(req,res,next) => {
    const user = res.locals.user;
    // Verify autor
    const actualPost = await Post.findOne({"_id" : req.body.postId})
    if (user.name == actualPost.autorName) {
        // Delete new post
        try {
            await Post.deleteOne({"_id" : req.body.postId});
            res.rawStatus = 200;
            res.rawResponse = ['Post deleted !'];
        }catch(err){
            res.rawStatus = 400;
            res.rawResponse = [err];
        }

    } else {
        res.rawStatus = 400;
        res.rawResponse = ['Delete failed !'];
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

// Get all users
router.get('/all-names', verify, async(req,res,next) => {
    if (res.locals.user){
        const users = await User.find({_id: { $exists: true }});
        const usersName = [];
        users.forEach(user => usersName.push(user.name));
        res.rawStatus = 200;
        res.rawResponse = [usersName];
    } else {
        res.rawStatus = 400
        res.rawResponse = (['Access denied !']);
    }
    next();
});


module.exports = router;