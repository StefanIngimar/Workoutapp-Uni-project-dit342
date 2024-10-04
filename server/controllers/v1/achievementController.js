//Dependencies
var express = require('express');
var router = express.Router();
// const jwt = require('jsonwebtoken');
var Achievement = require('../../models/achievementModel');
var User = require('../../models/userModel');


// Create a new achievement
router.post('/api/v1/achievements', async function(req, res) {

    let milestones = {};

    if (req.body.typeOfAchievement === 'weightLiftedMilestone') {
        const { exercise, weight } = req.body.milestones;

        milestones = { exercise, weight };
    } else if (req.body.typeOfAchievement === 'attendanceMilestone') {
        const { numOfTimesInGym } = req.body.milestones;

        milestones = { numOfTimesInGym };
    } else if (req.body.typeOfAchievement === 'repetitionMilestone') {
        const { exercise, reps } = req.body.milestones;

        milestones = { exercise, reps };
    } else {
        return res.status(400).json({ error: 'Invalid typeOfAchievement.' });
    }

    const achievement = new Achievement({
        name: req.body.name,
        exercisename: req.body.exercisename,
        description: req.body.description,
        typeOfAchievement: req.body.typeOfAchievement,
        milestones: milestones
    });

    try {
        const savedAchievement = await achievement.save();
        res.status(201).json(savedAchievement);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get all created achievements
router.get('/api/v1/achievements', async function(req, res){
    try{
        const allAchievements = await Achievement.find({});
        res.status(200).json(allAchievements);
    } catch(err){
        res.status(404).send(err);
    }
});

// Get a single achievement by ID
router.get('/api/v1/achievements/:id', async function(req, res, next){
    try{
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement){
            return res.status(404).json({message: "Achievement not found"});
        }
        res.status(200).json(achievement);
    } catch(err){
        next();
    }
});

// Get a single achievement by name
router.get('/api/v1/achievements/:name', async function(req, res){
    try{
        const achievement = await Achievement.find({name: req.params.name});
        res.status(200).json(achievement);
    } catch(err){
        res.status(404).json({error: err.message});
    }
});

// Delete an achievement
router.delete('/api/v1/achievements/:id', async function(req, res){
    try{
        const achievement = await Achievement.findByIdAndDelete(req.params.id);
        if (achievement){
            res.status(200).json({message: "Achievement successfully deleted"});
        } else {
            res.status(404).json({message: "Achievement not found"});
        }
    } catch(err){
        res.status(500).send(err);
    }
});

//Later add an admin delet all achievements




module.exports = router;
