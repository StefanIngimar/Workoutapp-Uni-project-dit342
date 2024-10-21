const express = require('express');
const router = express.Router();
const Leaderboard = require('../../models/leaderboardModel.js');
const WorkoutLog = require('../../models/workoutLogModel.js');
const User = require('../../models/userModel.js');
// Get the leaderboard. this goes through the workout log entries and displays the strongest lifts from users.
// We only display one user per entry. and if the user later beats their old personal record, the leaderboard is updated
// with the new entry
router.get('/api/v1/leaderboard', async function(req, res) {
    try {
        console.log("Fetching all workout logs...");
        const workoutLogs = await WorkoutLog.find({});
        const leaderboard = {};

        // Iterate through all workout logs and sessions within the logs to find the heaviest weight for each user
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

                    // the userNAME isnt actually a part of the leaderboard schema. so i fetched it from the user model via the user id
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
//coudlnt get the search to work so i just redid the get endpoint above but with a search functionality
//this is the filter in the leaderboard component, where the user can search for a specific exercise
router.get('/api/v1/searchLeaderboard', async function(req, res) {
    try {
        const { exercise } = req.query;
        if (!exercise) {
            return res.status(400).json({ error: 'Exercise name is required' });
        }
        const workoutLogs = await WorkoutLog.find({});
        // create a new leaderboard obj from the filtered workout logs
        const leaderboard = {};
        for (const log of workoutLogs) {
            for (const session of log.session) {
                for (const exerciseEntry of session.exercises) {
                    //skip invalid exercises
                    if (!exerciseEntry.name || !exerciseEntry.weight) {
                        console.warn(`Skipping invalid exercise entry in log ${log._id}`);
                        continue;
                    }
                    const userId = session.userID;
                    const exerciseName = exerciseEntry.name;
                    const weight = exerciseEntry.weight;
                    //dont want the same user to appear twice. only the strongest weight for eachh user
                    let user = await User.findById(userId).select('userName');
                    if (!leaderboard[userId] || leaderboard[userId].weight < weight) {
                        leaderboard[userId] = {
                            user: user ? user.userName : "Unknown User",
                            weight: weight,
                            exercise: exerciseName
                        };
                    }
                }
            }
        }

        // convert leaderboard from ibject to array
        let leaderboardArray = Object.values(leaderboard)
            .map(entry => ({
                user: entry.user,
                weight: entry.weight,
                exercise: entry.exercise
            }));

        // filter by the exercise name (case-insensitive ofc)
        leaderboardArray = leaderboardArray.filter(entry =>
            entry.exercise.toLowerCase().includes(exercise.toLowerCase())
        );

        // sort by weight (heaviest first)
        leaderboardArray.sort((a, b) => b.weight - a.weight);

        if (leaderboardArray.length === 0) {
            return res.status(200).json({ message: 'No valid entries found for the exercise' });
        }

        res.status(200).json(leaderboardArray);
        console.log('Filtered leaderboard by exercise:', leaderboardArray);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
//get leaderboard by specific leaderboard id
router.get('/api/v1/leaderboard/:id', async function(req, res){
    var id = req.params.id;
    try {
        const leaderboard = await Leaderboard.findById(id);
        res.status(200).json(leaderboard);}
    catch(err) {
        res.status(404).send(err)};});
//get a user in the leaderboard
router.get('/api/v1/leaderboard/:userid', async function(req, res){
    var userid = req.params.userid;
    try{
        const leaderboard = await Leaderboard.find({user: userid});
        res.status(200).json(leaderboard);}
    catch(err){
        res.status(404).send(err);}});
//this endpoint isnt used in the client, since the leaderboard is updated through the workoutlogs,
//who in turn are created in the dailysessions
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
// the idea at first was to only display the top 10 strongest users,
// but we decided to display all users instead
// however, this endpoint updates the leaderboard users
router.put('/api/v1/leaderboard/:userid', async function(req, res){
    var userid = req.params.userid;
    try{
        let leaderboard = await Leaderboard.findOneAndUpdate({user: userid}, req.body, {new: true});
        if(!leaderboard){
            return res.status(404).send({message: "User not found"});
        }
        res.status(200).json(leaderboard);
    } catch(err){
        res.status(500).send(err);
    }
});
//delete a user entry in the leaderboard
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
//deletes the entire leaderboard
router.delete('/api/v1/leaderboard', async function(req, res){
    try{
        const leaderboard = await Leaderboard.deleteMany({});
        res.status(204).send({leaderboard, message: "All leaderboard entries successfully deleted"});}
    catch(err){
        res.status(500).send(err);}});

exports = module.exports = router;
