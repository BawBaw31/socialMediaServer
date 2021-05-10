module.exports = function(req, res, next){
    const { user } = req.session;
    if(user) {
        res.locals.user = user;
    }
    next();
};