const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/leaderboardModel.js');

router.get('/api/leaderboard', async function(req, res){
    try {
        const allLeaderboard = await Leaderboard.find({});
        res.status(200).json(allLeaderboard)
    } catch(err) {
        res.status(404).send}});

router.get('/api/leaderboard/:id', async function(req, res){
    var id = req.params.id;
    try {
        const leaderboard = await Leaderboard.findById(id);}
    catch(err) {
        res.status(404).send(err)};});

router.get('/api/leaderboard/:userid', async function(req, res){
    var userid = req.params.userid;
    try{
        const leaderboard = await Leaderboard.find({user: userid});
        res.status(200).json(leaderboard);}
    catch(err){
        res.status(404).send(err);}});

router.post('/api/leaderboard/newleaderboard', async function(req, res){
    try {
        var leaderboard = new Leaderboard({
            'user' : req.body.user,
            'weight' : req.body.weight});
        const savedLeaderboard = await leaderboard.save();
        res.status(200).send(savedLeaderboard);}
    catch(err){
        res.status(500).send(err);}});

router.put('/api/leaderboard/:userid', async function(req, res){
    var userid = req.params.userid;
    try{
        let leaderboard = await Leaderboard.findOneAndUpdate({user: userid}, req.body);
        const leaderboardSize = await Leaderboard.countDocuments();
        if(leaderboardSize > 10){
            const userWithLeastWeight = await Leaderboard.findOne().sort({weight: 1});
            await Leaderboard.findByIdAndDelete(userWithLeastWeight._id);}
            res.status(200).json(leaderboard);}
            catch(err){
                res.status(500).send(err);
        }});

router.delete('/api/leaderboard/:userid', async function(req, res) {
    var userid = req.params.userid;
    try{
        const leaderboard = await Leaderboard.findByIdAndDelete({user: userid});
        res.status(200).send({leaderboard, message: "User successfully deleted from leaderboard"});}
    catch(err){
        res.status(500).send(err);}});

exports = module.exports = router;