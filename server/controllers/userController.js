var express = require('express');
var router = express.Router();

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
router.get('/api/users/:id', async function(req, res, next){
    var id = req.params.id;
    try{
        const aUser = await User.findById(id);
        res.status(200).json(aUser);
    } catch(err){
        next();
    }
});

// Return all Users in database by Username
router.get('/api/users/:userName', async function(req, res){
    var userName = req.params.userName;
    try{
        const User = await User.find({userName: userName});
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
router.post('/api/users', async function(req, res){
    var user = new User({
        'userName'   : req.body.userName,
        'email'      : req.body.email,
        'password'   : req.body.password,
        'profilePic' : req.body.profilePic
    });
    try{
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).send(err);
    }
});


// TODO
router.patch('/api/users/:id', async function(req, res){
    var id = req.params.id;
    try{
        const user = await User.findByIdAndUpdate(id,{ $set: {
            password : "as"
        }});
        res.status(201).send(user);
    } catch {err}{
        res.status(500).send(err);
    }
});


module.exports = router;

