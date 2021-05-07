module.exports = function(req, res, next){
    const { user } = req.session;
    if(!user) {
        res.rawStatus = 400
        res.rawResponse = (['Access denied !']);
    } else {
        res.locals.user = user;
    }
    next();
};