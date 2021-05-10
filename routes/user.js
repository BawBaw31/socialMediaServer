const router = require('express').Router();
const verify = require('../middlewares/verifySession');
const Post = require('../models/Post');

router.get('/:userId/news', verify, (req,res,next) => {
    if (res.locals.user && res.locals.user._id == req.params.userId){
        res.rawStatus = 200;
        res.rawResponse = res.locals.user;
    } else {
        res.rawStatus = 400
        res.rawResponse = (['Access denied !']);
    }
    next();
});

router.post('/create', verify, async(req,res,next) => {
    const user = res.locals.user;
    if (user) {
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
        res.rawResponse = ['You are not loged in !'];
    }
    next();
});

module.exports = router;