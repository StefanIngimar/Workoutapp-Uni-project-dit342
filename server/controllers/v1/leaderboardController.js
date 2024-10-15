const express = require('express');
const router = express.Router();
const Leaderboard = require('../../models/leaderboardModel.js');
const WorkoutLog = require('../../models/workoutLogModel.js');
const User = require('../../models/userModel.js');

router.get('/api/v1/leaderboard', async function(req, res) {
    try {
        console.log("Fetching all workout logs...");
        const workoutLogs = await WorkoutLog.find({});
        const leaderboard = {};

        // Iterate through all workout logs and sessions to find the heaviest weight for each user
        for (const log of workoutLogs) {
            for (const session of log.session) {
                for (const exercise of session.exercises) {
                    console.log("Processing exercise entry:", exercise);

                    // Ensure the exercise has necessary fields
                    if (!exercise || !exercise.name || !exercise.weight) {
                        console.warn(`Skipping invalid exercise entry in log ${log._id}`);
                        continue;
                    }

                    const userId = session.userID;
                    const exerciseName = exercise.name;
                    const weight = exercise.weight;

                    // smart query solution to get the user name
                    let user = await User.findById(userId).select('userName');
                    
                    // check if this is the heaviest weight for the user. cant have the same user to appear twice in the leaderboard
                    if (!leaderboard[userId] || leaderboard[userId].weight < weight) {
                        leaderboard[userId] = {
                            user: user ? user.userName : "Unknown User", // handle where user isn't found
                            weight: weight,
                            exercise: exerciseName
                        };
                    }
                }
            }
        }

        // Convert the leaderboard object to an array
        const leaderboardArray = Object.values(leaderboard)
            .map(entry => ({
                user: entry.user,
                weight: entry.weight,
                exercise: entry.exercise
            }));
        //sort the array by weight
        leaderboardArray.sort((a, b) => b.weight - a.weight);

        // error handling for empty leaderboard
        if (leaderboardArray.length === 0) {
            return res.status(200).json({ message: 'No valid entries found for leaderboard' });
        }

        res.status(200).json(leaderboardArray);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/api/v1/searchLeaderboard', async function(req, res) {
    try {
        const { exercise } = req.query;
        if (!exercise) {
            return res.status(400).json({ error: 'Exercise name is required' });
        }
        // find leaderboard entries by exercise name (case-insensitive ofc)
        const leaderboard = await WorkoutLog.find({ 'session.exercises.name': { $regex: exercise, $options: 'i' } });
        if (leaderboard.length === 0) {
            return res.status(200).json([]); // return empty if no results are found
        }
        // create a new leaderboard array from the filtered workout logs
        const leaderboardArray = [];
        for (const log of leaderboard) {
            for (const session of log.session) {
                for (const exerciseEntry of session.exercises) {
                    if (exerciseEntry.name.toLowerCase().includes(exercise.toLowerCase())) {
                        leaderboardArray.push({
                            userName: session.userName,
                            weight: exerciseEntry.weight,
                            exercise: exerciseEntry.name
                        });
                    }
                }
            }
        }
        // sort the list again by weight
        leaderboardArray.sort((a, b) => b.weight - a.weight);
        res.status(200).json(leaderboardArray);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

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

router.post("/api/v1/leaderboard", async function (req, res) {
  try {
    const { user, userName, weight, exercise } = req.body;

    if (!user || !userName || !weight || !exercise) {
      return res
        .status(400)
        .json({
          error: "Missing required fields: user, userName, weight, exercise",
        });
    }

    // create a new leaderboard entry with the exercise
    var leaderboard = new Leaderboard({
      user: user,
      userName: userName,
      weight: weight,
      exercise: exercise,
    });

    const savedLeaderboard = await leaderboard.save();

    res.status(200).json(savedLeaderboard);
  } catch (err) {
    console.error("Error saving leaderboard entry:", err);
    res.status(500).json({ error: "Server error" });
  }
});

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
    try{
        const leaderboard = await Leaderboard.deleteMany({});
        res.status(204).send({leaderboard, message: "All leaderboard entries successfully deleted"});}
    catch(err){
        res.status(500).send(err);}});

exports = module.exports = router;
