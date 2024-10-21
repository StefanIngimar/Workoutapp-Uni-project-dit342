//Dependencies
var express = require('express');
var router = express.Router();

// Imported external libraries
/*
Express validator to verify email.
Documentation on methods from:
"https://express-validator.github.io/docs/guides/getting-started/"
*/ 
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// Parse from .env file
const JWT_SECRET = process.env.JWT_SECRET;

/*
 Multer to handle file uplods.
 Documentation on methods from:
 https://www.npmjs.com/package/multer
*/
// const multer = require('multer');
// const path = require('path');

// Imported helper functions
const {checkDuplicateUserOrEmail} = require('../../helpers/helperFunctions');

// Imported models
var User = require('../../models/userModel');
const { error } = require('console');


// Multer configuration to store profile pictures in uploads folder
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'uploads/');
//     },
//     filename: function(req, file, cb){
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({storage: storage});



// Return all Users
router.get('/api/v1/users', async function(req, res){
    try {
        const allUsers = await User.find({}).select('-password');
        res.status(200).json(allUsers);
    } catch(err){
        res.status(404).json({error: err.message});
    }
});


// Return single User
router.get('/api/v1/users/:id', async function(req, res, next){
    var id = req.params.id;
    try{
        const aUser = await User.findById(id).select('-password');
        if (!aUser){
            return res.status(404).send({message: "User not found"});
        }
        res.status(200).json(aUser);
    } catch(err){
        next();
    }
});

// Return user in database by Username
router.get('/api/v1/users/:userName', async function(req, res){
    var userName = req.params.userName;
    try{
        const aUser = await User.find({userName: userName}).select('-password');
        res.status(200).json(aUser);
    }catch(err){
        res.status(404).json({error: err.message});
    }
});


// Delete a User by id
router.delete('/api/v1/users/:id', async function(req, res){
    var id = req.params.id;
    try{
        var aUser = await User.findByIdAndDelete(id);
        if (aUser){
            res.status(200).json({message: "User successfully deleted"}); 
        } else {
            res.status(404).json({message: "User not found"});
        }
    } catch(err){
        res.status(500).json({error: err.message});
    }
});


// Creation of a new User
router.post('/api/v1/users', //upload.single('profilePic'),
    [   
        // Express validator to check if the username, email, and password are valid
        body('userName').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Enter a valid email in the format xxx@xxx.xxx'),
        body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long')
    ], 
    async function(req, res){
        // Call helper to check username and email
        const duplicateUserOrEmail = await checkDuplicateUserOrEmail(req.body.userName, req.body.email);
        if (duplicateUserOrEmail){
            return res.status(400).json({error: duplicateUserOrEmail.error});
        }
        // If the email and username are not taken, proceed with user creation
        const queryResult = validationResult(req);
        if (queryResult.isEmpty()){
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            var user = new User({
                'userName'   : req.body.userName,
                'email'      : req.body.email,
                'password'   : hashedPassword,
                'isAdmin'    : req.body.isAdmin,
                'achievements' : [],
                // 'profilePic' : req.file ? req.file.filename : null
            });
        } else {
            return res.status(400).json({errors: queryResult.array()});
        }
    try{
        const savedUser = await user.save();
        //  const token = jwt.sign({userId: savedUser._id, userName: savedUser.userName}, JWT_SECRET);
        const responseUser = {
            _id: savedUser._id,
            userName: savedUser.userName,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin,
            achievements: savedUser.achievements
        }
        res.status(201).json(responseUser);
        // res.status(201).json({user: responseUser, token: token});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// User login route
// Use post request to login instead of get request because we are sending a password
// GET requests are not secure for sending passwords
router.post('/api/v1/users/login', async function(req, res){
    const {userName, password} = req.body;
    try{
        const user = await User.findOne({userName: userName});
        if (!user){
            return res.status(400).json({error: 'User not found'});
        }
        // const userPassword = await bcrypt.hash(req.body.password, 10);
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword){
            return res.status(400).json({error: 'Invalid password'});
        }

        // if (password !== user.password){
        //     return res.status(400).json({error: 'Invalid password'});
        // }

        // const token = jwt.sign({userId: user._id, userName: user.userName}, JWT_SECRET);
        const responseUser = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            isAdmin: user.isAdmin,
            achievements: user.achievements
        }

        res.status(200).json(responseUser);//,
            //token: token
    ;
        
    } catch(err){
        res.status(500).json({error: err.message});
    }
});


// Updates a certain field, should only be partial
router.patch('/api/v1/users/:id', //upload.single('profilePic'),
    [
        // Express validator to check if the username, email, and password are valid
        body('userName').optional().notEmpty().withMessage('If you wish to change username, enter a new non empty username'),
        body('email').optional().isEmail().withMessage('Enter a valid email in the format xxx@xxx.xxx'),
        body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ],
    async function (req, res) {
        const queryResult = validationResult(req);
        if (!queryResult.isEmpty()) {
            return res.status(400).json({ errors: queryResult.array() });
        }
        try {
            // Calling helper to check email and username if they are provided
            if (req.body.userName || req.body.email) {
                const duplicateUserOrEmail = await checkDuplicateUserOrEmail(req.body.userName, req.body.email);
                if (duplicateUserOrEmail) {
                    return res.status(400).json({ error: duplicateUserOrEmail.error });
                }
            }

            var id = req.params.id;
            let updateFields = {};

            if (req.body.userName) updateFields.userName = req.body.userName;
            if (req.body.password) updateFields.password = req.body.password;
            if (req.body.email) updateFields.email = req.body.email;
            // if (req.file) updateFields.profilePic = req.file.filename;

            // Find user by id and update fields with $set
            const user = await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
            if (user){
                res.status(200).json(user);
            } else {
                res.status(404).json({message: 'User not found'});
            }
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    });


module.exports = router;