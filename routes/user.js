const router = require('express').Router();
const verify = require('../middlewares/verifySession');
const { findOneAndDelete } = require('../models/Post');
const Post = require('../models/Post');
const User = require('../models/User');

// Getting friends news
router.get('/news', verify, async(req,res,next) => {
    if (res.locals.user){
        const user = await User.findOne({_id: res.locals.user._id});
        const news =  await Post.find(
            user.friends.forEach(friend => {autorName: friend})
            ).sort({date: -1});
        console.log(news);
        res.rawStatus = 200;
        res.rawResponse = [news, user];
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

module.exports = router;