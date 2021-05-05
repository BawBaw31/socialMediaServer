module.exports = function(req, res, next){
    const { user } = req.session;
    console.log(user);
    if(!user) return res.status(401).send('Access Denied');
    res.locals.user = user;
    next();
};