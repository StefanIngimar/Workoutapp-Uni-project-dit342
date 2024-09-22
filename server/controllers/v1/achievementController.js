//Dependencies
var express = require('express');
var router = express.Router();

var Achievement = require('../../models/achievementModel');
var User = require('../../models/userModel');



// // Return all achievements
// router.get('/api/v1/achievements', async function(req, res) {
//     try{
//         const allAchievements = await Achievement.find({});
//         res.status(200).json(allAchievements);
//     } catch(err){
//         res.status(404).send;
//     }
// });

// //Return all achievements for a single user
// router.get('/api/v1/achievements/:userName', async function(req, res) {
//     try{
//         const allAchievements = await Achievement.find({
//             userName: req.params.userName
//         }).populate('exerciseMilestone').populate('numOfTimesInGym');
//         res.status(200).json(allAchievements);
//     } catch(err){
//         res.status(404).send;
//     }
// });

// // Return a single achievement that all users have
// router.get('/api/v1/achievements/:achievementID/users', async function(req, res){
//     var achievementID = req.params.achievementID;
//     try{
//         const usersWithAchievement = await User.find({achievements: achievementID});
//         res.status(200).json(usersWithAchievement);
//     } catch(err){
//         res.status(404).send;
//     }
// });

// // Delete an achievement
// router.delete('/api/v1/achievements/:id', async function(req, res){
//     var id = req.params.id;
//     try{
//         const singleAchiev = await Achievement.findByIdAndDelete(id);
//         res.status(200).send({singleAchiev, message: "Achievement deleted"});
//     } catch (err){
//         res.status(404).send(err);
//     }
// });

// router.post('/api/v1/achievements', async function(req, res){
//     try{
//         // Error handling for a user
//         const user = await User.findById(req.body.userID);
//         if(!user){
//             return res.status(404).json({message: "User not found"});
//         }
//         // Create a new achievement
//         var achievement = new Achievement({
//             'userID' : req.body.userID,
//             'description' : req.body.description,
//             'exerciseMilestone' : req.body.exerciseMilestone,
//             'numOfTimesInGym' : req.body.numOfTimesInGym
//         });
//         // Save the achievement
//         const savedAchievement = await achievement.save();
//         res.status(201).json(savedAchievement);
//     } catch (err){
//         res.status(500).send(err);
//     }
// });

// // Updates an achievement for a user
// router.patch('/api/v1/achievements/:id', async function(req, res){
//     var id = req.params.id;
//     try{
//         // Error handling for a user
//         const user = await User.findById(req.body.userID);
//         if(!user){
//             return res.status(404).send({message: "User not found"});
//         }
//         const achievement = await Achievement.findByIdAndUpdate(id, {
//             $set: {
//                 exerciseMilestone: req.body.exerciseMilestone,
//                 numOfTimesInGym: req.body.numOfTimesInGym
//             }
//         }, {new: true});
//         res.status(201).send(achievement);
//     } catch(err){
//         res.status(500).send(err);
//     }
// });


// Post a new achievement of any enum type
router.post('/api/v1/achievements', async function(req, res){
    try{
        const achievement = new Achievement(req.body);
        const savedAchievement = await achievement.save();
        res.status(201).json(savedAchievement);
    } catch(err){
        res.status(500).send(err);
    }
});

// Get all achievements
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




module.exports = router;
