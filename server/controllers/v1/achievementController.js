//Dependencies
var express = require('express');
var router = express.Router();
// const jwt = require('jsonwebtoken');
var Achievement = require('../../models/achievementModel');
var User = require('../../models/userModel');
const { use } = require('./exerciseController');
var DailySession = require('../../models/dailySessionModel');
var WorkoutLog = require('../../models/workoutLogModel');


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
        userID: req.body.userID,
        name: req.body.name,
        exercisename: req.body.exercisename,
        description: req.body.description,
        typeOfAchievement: req.body.typeOfAchievement,
        milestones: milestones,
        isCompleted: false,
        dateCompleted: null
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
    const userId = req.query.userID;
    const isAdmin = req.query.isAdmin === 'true';
    try{
        if (isAdmin) { 
            const allAchievements = await Achievement.find({});
            res.status(200).json(allAchievements);
        } else {
            const userSpecificAchievements = await Achievement.find({userID: userId});
            res.status(200).json(userSpecificAchievements);
        }
    } catch(err){
        res.status(404).send(err);
    }
});

// Return all achievements that are completed
router.get('/api/v1/achievements/completed', async function(req, res) {
    const userId = req.query.userID;
    const isAdmin = req.query.isAdmin === 'true';
    try {
        if (isAdmin) {
            const allCompletedAchievements = await Achievement.find({ isCompleted: true });
            res.status(200).json(allCompletedAchievements);
        } else {
            const userCompletedAchievements = await Achievement.find({ userID: userId, isCompleted: true });
            res.status(200).json(userCompletedAchievements);
        }
    } catch (err) {
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

// Get all achievements for a specific user
router.get('/api/v1/users/:userId/achievements', async function(req, res){
    try{
        const achievements = await Achievement.find({userID: req.params.userId})
        res.status(200).json(achievements);
    } catch(err){
        res.status(404).json({error: err.message});
    }
});

// // Get specific achievement for a specific user
// router.get('/api/v1/users/:userId/achievements/:achievementId', async function(req, res){
//     try{
//         const achievement = await Achievement.findOne({userID: req.params.userId, achievementID: req.params.achievementId});
//         res.status(200).json(achievement);
//     } catch(err){
//         res.status(404).json({error: err.message});
//     }
// });


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


// Update an achievement
router.patch('/api/v1/achievements/:achievementID', async function(req, res){
    try{
        const achievement = await Achievement.findById(req.params.achievementID);
        if (!achievement){
            return res.status(404).json({message: "Achievement not found"});
        }
        if (achievement.typeOfAchievement === 'weightLiftedMilestone' || achievement.typeOfAchievement === 'repetitionMilestone'){
            const dailySession = await DailySession.find({});
            if (!dailySession){
                return res.status(404).json({message: "Daily session not found"});
            }
            dailySession.forEach(session => {
                session.exercises.forEach(exercise => {
                    if (exercise.name === achievement.exercisename && session.isCompleted === true){
                        if(achievement.typeOfAchievement === 'weightLiftedMilestone' && exercise.weight >= achievement.milestones.weight){
                            // achievementCopy = await Achievement.findByIdAndUpdate(req.params.achievementID, {$set: {isCompleted: true}}, {new: true});
                            achievement.isCompleted = true;
                        }
                        if (achievement.typeOfAchievement === 'repetitionMilestone' && exercise.reps >= achievement.milestones.reps){
                            // achievementCopy = await Achievement.findByIdAndUpdate(req.params.achievementID, {$set: {isCompleted: true}}, {new: true});
                            achievement.isCompleted = true;
                        }
                    }
                });
            });
        }
        if (achievement.isCompleted === true){
            achievement.dateCompleted = new Date();
        }
        const updatedUserAchievement = await achievement.save();
        res.status(200).json(updatedUserAchievement);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});





module.exports = router;
