var express = require('express');
var router = express.Router();

var UserAchievement = require('../../models/userAchievementModel');
var Achievement = require('../../models/achievementModel');
var User = require('../../models/userModel');

//TODO: Add a route to get all achievements for a user
//TODO: Add a route to get a single achievement for a user
//TODO: Add a route to update a user achievement
//TODO: Add a route to delete a user achievement
//TODO: Add a route to get all users who have completed a specific achievement


// Create a new user achievement
router.post('/api/v1/users/:userId/achievements/:achievementId', async function(req, res){
    try{
        const newUserAchievement = new UserAchievement({
            user : req.params.userId,
            achievement : req.params.achievementId,
            isCompleted : req.body.isCompleted,
            dateCompleted : req.body.dateCompleted
        });
        const savedUserAchievement = await newUserAchievement.save();
        await savedUserAchievement.populate('user').populate('achievement').execPopulate();
        res.status(201).json(savedUserAchievement);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});


module.exports = router;