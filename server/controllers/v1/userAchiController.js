var express = require('express');
var router = express.Router();

var UserAchievement = require('../../models/userAchievementModel');
var Achievement = require('../../models/achievementModel');
var User = require('../../models/userModel');
var DailySession = require('../../models/dailySessionModel');
var WorkoutLog = require('../../models/workoutLogModel');




// Get all user achievements
router.get('/api/v1/userAchievements', async function(req, res){
    try{
        const userAchievements = await UserAchievement.find();
        res.status(200).json(userAchievements);
    } catch(err){
        res.status(404).json({error: err.message});
    }
});


// Get all user achievements for a specific user
router.get('/api/v1/users/:userId/userAchievements', async function(req, res){
    try{
        const userAchievements = await UserAchievement.find({userID: req.params.userId});
        res.status(200).json(userAchievements);
    } catch(err){
        res.status(404).json({error: err.message});
    }
});

// Get specific user achievement for a specific user
router.get('/api/v1/users/:userId/userAchievements/:userAchievementId', async function(req, res){
    try{
        const userAchievement = await UserAchievement.findOne({userID: req.params.userId, _id: req.params.userAchievementId});
        res.status(200).json(userAchievement);
    } catch(err){
        res.status(404).json({error: err.message});
    }
});



// Get a single user achievement by ID
router.get('/api/v1/userAchievements/:userAchievementId', async function(req, res, next){
    try{
        const userAchievement = await UserAchievement.findById(req.params.userAchievementId);
        if (!userAchievement){
            return res.status(404).json({message: "User achievement not found"});
        }
        res.status(200).json(userAchievement);
    } catch(err){
        next();
    }
});

// Get a single user achievement by achievement name
router.get('/api/v1/userAchievements/:achievementName', async function(req, res){
    try{
        const userAchievements = await UserAchievement.find({achievementName: req.params.achievementName});
        if (!userAchievements){
            return res.status(404).json({message: "User achievement not found"});
        }
        res.status(200).json(userAchievements);
    } catch(err){
        res.status(404).json({error: err.message});
    }
});

// Get all user achievements associated with an achievement by achievement ID
router.get('/api/v1/userAchievements/:achievementId/users', async function(req, res, next){
    try{
        const userAchievements = await UserAchievement.find({achievement: req.params.achievementId});
        res.status(200).json(userAchievements);
    } catch(err){
        next();
    }
});

// Get all user achievements associated with an achievement by achievement name
router.get('/api/v1/userAchievements/:achievementName/users', async function(req, res){
    try{
        const userAchievements = await UserAchievement.find({achievementName: req.params.achievementName});
        res.status(200).json(userAchievements);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});


// Create a new user achievement
router.post('/api/v1/userAchievements', async function(req, res){
    
    const newUserAchievement = new UserAchievement({
            userID : req.body.userID,
            achievementID : req.body.achievementID,
            achievementName : req.body.achievementName,
            isCompleted : req.body.isCompleted,
            dateCompleted : req.body.dateCompleted
        });
    try{
        const savedUserAchievement = await newUserAchievement.save();
        res.status(201).json(savedUserAchievement);
    } catch(err){
        res.status(404).json({error: err.message});
    }
});

// Delete a user achievement
router.delete('/api/v1/userAchievements/:userAchievementId', async function(req, res){
    try{
        const deletedUserAchievement = await UserAchievement.findByIdAndDelete(req.params.userAchievementId);
        if (deletedUserAchievement){
            res.status(200).json({message: "User achievement successfully deleted"});
        } else {
            res.status(404).json({message: "User achievement not found"});
        }
    } catch(err){
        res.status(500).json({error: err.message});
    }
});


// Update a user achievement
router.patch('/api/v1/userAchievements/:userAchievementID', async function(req, res){
    try{
        const userAchievement = await UserAchievement.findById(req.params.userAchievementID);
        if (!userAchievement){
            return res.status(404).json({message: "User achievement not found"});
        }
        const achievement = await Achievement.findById(userAchievement.achievementID);
        if (!achievement){
            return res.status(404).json({message: "Achievement not found"});
        }
        if (achievement.typeOfAchievement === 'weightLiftedMilestone' || achievement.typeOfAchievement === 'repetitionMilestone'){
            const dailySession = await DailySession.find({userID : userAchievement.userID});
            if (!dailySession){
                return res.status(404).json({message: "Daily session not found"});
            }
            dailySession.forEach(session => {
                session.exercises.forEach(exercise => {
                    if (exercise.name === achievement.exercisename && session.isCompleted === true){
                        if(achievement.typeOfAchievement === 'weightLiftedMilestone' && exercise.weight >= achievement.milestones.weight){
                            userAchievement.isCompleted = true;
                        }
                        if (achievement.typeOfAchievement === 'repetitionMilestone' && exercise.reps >= achievement.milestones.reps){
                            userAchievement.isCompleted = true;
                        }
                    }
                });
            });
        } else if (achievement.typeOfAchievement === 'attendanceMilestone'){
            const workoutLog = await WorkoutLog.find({user : userAchievement.userID});
            if (!workoutLog){
                return res.status(404).json({message: "Workout log not found"});
            }
            if (workoutLog.session.length >= achievement.milestones.numOfTimesInGym){
                userAchievement.isCompleted = true;
            }
        }
        if (userAchievement.isCompleted === true){
            userAchievement.dateCompleted = new Date();
        }
        const updatedUserAchievement = await userAchievement.save();
        res.status(200).json(updatedUserAchievement);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});




module.exports = router;