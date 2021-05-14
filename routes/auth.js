const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { registerValidation } = require('../utils/validation');
const { resetPasswordValidation } = require('../utils/validation');

// Register
router.post('/register', async (req, res, next) => {
    let errorArray = [];

    // Validation
    const { error } = registerValidation(req.body);
    if(error){
        errorArray.push(error.details[0].message);
    }
    
    // Checking if password == verifPassword
    if(req.body.password !== req.body.verifPassword){
        errorArray.push("Passwords doesn't match !");
    } 

    // Checking if already in database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist){
        errorArray.push('Email already exists !');
    } 
    
    if (errorArray.length !== 0){
        res.rawStatus = 400;
        res.rawResponse = errorArray;
    }else {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
    
        // Create new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            friends: [req.body.name]
        });
    
        try {
            await user.save();
            res.rawStatus = 200;
            res.rawResponse = ['Registration successfull !'];
        }catch(err){
            res.rawStatus = 400;
            res.rawResponse = [err];
        }
    }

    next();
});

//  Login
router.post('/login', async (req, res, next) => {
    let errorArray = [];

    // Check if email exists
    const user = await User.findOne({email: req.body.email});
    if(!user){
        errorArray.push('Email or password is wrong !');
    } else {
        // Check if password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass){
            errorArray.push('Email or password is wrong !');
        } 
    }

    res.rawStatus = 400;
    res.rawResponse = errorArray;

    // Open session
    if (errorArray.length === 0){
        req.session.user = {
            _id: user._id,
            name: user.name
        }
        res.rawStatus = 200;
        res.rawResponse = [user._id];
    }

    next();
});

// Forgot password
router.post('/forgot-password', async (req,res,next) => {
    // Check if email exists
    const user = await User.findOne({email: req.body.email});
    if(!user){
        res.rawStatus = 400;
        res.rawResponse = ['User not registered !'];
    } else {
        // Create a one time link 
        const secret = process.env.TOKEN_SECRET + user.password;
        const payload = {
            email: user.email,
            id: user.id
        };
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
        const link = `http://localhost:3000/api/user/reset-password/${user.id}/${token}`;

        // Send the link by email
        console.log(link);


        res.rawStatus = 200;
        res.rawResponse = ['Password reset link has been sent to your email adress !'];
    }

    next();
});

// Reset Password
router.get('/reset-password/:id/:token', async (req,res,next) => {
    const { id, token } = req.params;

    // Check if id exists in database
    const user = await User.findOne({_id: id});
    if(!user){
        res.rawStatus = 400;
        res.rawResponse = ['Wrong link...'];
    } else {
        const secret = process.env.TOKEN_SECRET + user.password;
        try {
            const payload = jwt.verify(token, secret);
            // Render reset password page
            console.log('render');
            res.rawStatus = 200;
            res.rawResponse = 'You are updating your password !';
        } catch (err) {
            res.rawStatus = 400;
            res.rawResponse = [err.message];
        }
    }

    next();
})

router.post('/reset-password/:id/:token', async (req,res,next) => {
    let errorArray = [];
    const { id, token } = req.params;
    const { password, verifPassword } = req.body;

    // Check if id exists in database
    console.log('id checking');
    const user = await User.findOne({_id: id});
    if(!user){
        errorArray.push('Wrong request...');
    } else {
        const secret = process.env.TOKEN_SECRET + user.password;
        try {
            const payload = jwt.verify(token, secret);

            // Validation
            const { error } = resetPasswordValidation(req.body);
            if(error){
                errorArray.push(error.details[0].message);
            } else if(password !== verifPassword){
                errorArray.push('Both passwords should match !');
            } else {
                // Find user and modify password in database
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(req.body.password, salt);
                await User.updateOne({_id: id}, {password: hashPassword});
                res.rawStatus = 200;
                res.rawResponse = ['Your password has been updated !'];
            }
        } catch (err) {
            errorArray.push(err.message);
        }
    }
    if (errorArray.length == 0) {
        res.rawStatus = 400;
        res.rawResponse = errorArray;
    }
    
    next();
});

//  Logout
router.get('/logout', async (req, res, next) => {

    // Close session
    req.session.user = {};
    res.rawStatus = 200;
    res.rawResponse = ['You loged out !'];

    next();
});


module.exports = router;