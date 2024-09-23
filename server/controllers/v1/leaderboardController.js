const express = require('express');
const router = express.Router();
const Leaderboard = require('../../models/leaderboardModel.js');

router.get('/api/v1/leaderboard', async function(req, res){
    try {
        const allLeaderboard = await Leaderboard.find({});
        res.status(200).json(allLeaderboard)
    } catch(err) {
        res.status(404).send}});

router.get('/api/v1/leaderboard/:id', async function(req, res){
    var id = req.params.id;
    try {
        const leaderboard = await Leaderboard.findById(id);
        res.status(200).json(leaderboard);}
    catch(err) {
        res.status(404).send(err)};});

router.get('/api/v1/leaderboard/:userid', async function(req, res){
    var userid = req.params.userid;
    try{
        const leaderboard = await Leaderboard.find({user: userid});
        res.status(200).json(leaderboard);}
    catch(err){
        res.status(404).send(err);}});

router.post('/api/v1/leaderboard', async function(req, res){
    try {
        var leaderboard = new Leaderboard({
            'user' : req.body.user,
            'weight' : req.body.weight
        });
        const savedLeaderboard = await leaderboard.save();
        res.status(200).send(savedLeaderboard);}
    catch(err){
        res.status(500).send(err);}});

router.put('/api/v1/leaderboard/:userid', async function(req, res){
    var userid = req.params.userid;
    try{
        let leaderboard = await Leaderboard.findOneAndUpdate({user: userid}, req.body, {new: true});
        if(!leaderboard){
            return res.status(404).send({message: "User not found"});
        } const leaderboardSize = await Leaderboard.countDocuments();
        if(leaderboardSize > 10){
            const userWithLeastWeight = await Leaderboard.findOne().sort({weight: 1});
            if(userWithLeastWeight._id.toString() !== leaderboard._id.toString()){
                await Leaderboard.findOneAndDelete({_id: userWithLeastWeight._id});
            }
        }
        res.status(200).json(leaderboard);
    } catch(err){
        res.status(500).send(err);
    }
});

router.delete('/api/v1/leaderboard/:userid', async function(req, res) {
    var userid = req.params.userid;
    try{
        const leaderboard = await Leaderboard.findOneAndDelete({user: userid});
        if(leaderboard){
            res.status(204).send({leaderboard, message: "Leaderboard entry successfully deleted"});
        } else{
            res.status(404).send({message: "Leaderboard entry not found"});
        }
    }catch(err){
            res.status(500).send(err);}});

router.delete('/api/v1/leaderboard', async function(req, res){
    //TODO add admin check after merge
    try{
        const leaderboard = await Leaderboard.deleteMany({});
        res.status(204).send({leaderboard, message: "All leaderboard entries successfully deleted"});}
    catch(err){
        res.status(500).send(err);}});

exports = module.exports = router;