//Dependencies
var express = require('express');
var router = express.Router();

var Achievement = require('../models/achievementModel');

// Return all achievements
router.get('/api/achievements', async function(req, res) {
    try{
        const allAchievements = await Achievement.find({});
        res.status(200).json(allAchievements);
    } catch(err){
        res.status(404).send;
    }
});

//Return all achievements for a single user
router.get('/api/achievements/userName', async function(req, res) {
    try{
        const allAchievements = await Achievement.find({
            username: req.params.username
        }).populate('exerciseMilestone').populate('numOfTimesInGym');
        res.status(200).json(allAchievements);
    } catch(err){
        res.status(404).send;
    }
});



router.delete('/api/achievements/:id', async function(req, res){
    var id = req.params.id;
    try{
        const singleAchiev = await Achievement.findByIdAndDelete(id);
        res.status(200).send({singleAchiev, message: "Achievement deleted"});
    } catch (err){
        res.status(404).send(err);
    }
});

router.post('/api/achievements/newachievement', async function(req, res){
    try{    
            var achievement = new Achievement({
            'userID' : req.body.userID,
            'description' : req.body.description,
            'exerciseMilestone' : req.body.exerciseMilestone,
            'numOfTimesInGym' : req.body.numOfTimesInGym
    });
        const savedAchievement = await achievement.save();
        res.status(201).json(saved);
    } catch (err){
        res.status(500).send(err);
    }
});

// Updates an achievement for a user
router.patch('/api/achievements/:id', async function(req, res){
    //TODO
});
