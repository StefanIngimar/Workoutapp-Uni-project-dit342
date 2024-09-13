//Dependencies
var express = require('express');
var router = express.Router();
/*
Express validator to verify email from: 
"https://express-validator.github.io/docs/guides/getting-started/"
*/ 
const {body, validationResult} = require('express-validator');

// Uses user model
var User = require('../models/userModel');

// Return all Users from database
router.get('/api/users', async function(req, res){
    try {
        const allUsers = await User.find({});
        res.status(200).json(allUsers);
    } catch(err){
        res.status(404).send(err);
    }
});


// Return single User from database
router.get('/api/users/:id', async function(req, res){
    var id = req.params.id;
    try{
        const aUser = await User.findById(id);
        res.status(200).json(aUser);
    } catch(err){
        res.status(404).send(err);
    }
});

// Return user in database by Username
router.get('/api/users/:userName', async function(req, res){
    var userName = req.params.userName; //extract userName from URL parameter
    try{
        // Queries database for user that matches URL
        const aUser = await User.find({userName: userName});
        // If query is succesful respond to client with status code 200 and send back requested user as JSON
        res.status(200).json(aUser);
    }catch(err){
        res.status(404).send(err);
    }
});


// Delete a User by id
router.delete('/api/users/:id', async function(req, res){
    var id = req.params.id;
    try{
        var aUser = await User.findByIdAndDelete(id);
        res.status(200).send({message: "User successfully deleted"}); 
    } catch(err){
        res.status(500).send(err);
    }
});



// Creation of a new User
router.post('/api/users',
    [
        body('email').isEmail().withMessage('Enter a valid email in the format xxx@xxx.xxx')
    ], 
    async function(req, res){
        const queryResult = validationResult(req);
        if (queryResult.isEmpty()){
            var user = new User({
                'userName'   : req.body.userName,
                'email'      : req.body.email,
                'password'   : req.body.password,
                'profilePic' : req.body.profilePic
            });
        } else {
            return res.status(400).json({errors: queryResult.array()});

        }
    try{
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).send(err);
    }
});


// Updates a certain field
router.patch('/api/users/:id', async function(req, res){
    var id = req.params.id;
    try{
        const user = await User.findByIdAndUpdate(id, { 
            $set: { 
                password: req.body.password,
                email: req.body.email,
                profilePic: req.body.profilePic},
            },
        {new: true});
        res.status(201).send(user);
    } catch(err){
        res.status(500).send(err);
    }
});




module.exports = router;

