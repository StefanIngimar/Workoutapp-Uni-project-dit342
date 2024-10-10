const express = require('express');
const router = express.Router();
const Leaderboard = require('../../models/leaderboardModel.js');
const WorkoutLog = require('../../models/workoutLogModel.js');
const jwt = require('jsonwebtoken');

router.get('/api/v1/leaderboard', async function(req, res) {
    try {
        console.log("Fetching all workout logs...");

        const workoutLogs = await WorkoutLog.find({})
            .populate('session.user', 'userName')
            .populate('session.exercises.exercise', 'name')
            .exec();

        const leaderboard = {};

        // Iterate through all workout logs and sessions to find the heaviest weight for each user
        workoutLogs.forEach(log => {
            log.session.forEach(session => {
                session.exercises.forEach(exercise => {
                    console.log("Processing exercise entry:", exercise);

                    // Check if the exercise and its details are populated properly
                    if (!exercise || !exercise.exercise || !exercise.exercise.name || exercise.exercise.name === "" || !exercise.weight) {
                        console.warn(`Skipping invalid exercise entry in log ${log._id}: Missing required fields`);
                        return;
                    }

                    const userId = session.user._id;
                    const userName = session.user.userName;
                    const exerciseName = exercise.exercise.name;
                    const weight = exercise.weight;

                    // Check if this user has lifted more weight for this exercise
                    if (!leaderboard[userId] || leaderboard[userId].weight < weight) {
                        leaderboard[userId] = {
                            user: userName,
                            weight: weight,
                            exercise: exerciseName
                        };
                    }
                });
            });
        });

        // Convert the leaderboard object to an array
        const leaderboardArray = Object.values(leaderboard)
            .map(entry => `${entry.user}, ${entry.weight}kg, ${entry.exercise}`);

        if (leaderboardArray.length === 0) {
            return res.status(200).json({ message: 'No valid entries found for leaderboard' });
        }

        // Respond with the leaderboard
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

    // Create a new leaderboard entry with the exercise
    var leaderboard = new Leaderboard({
      user: user,
      userName: userName,
      weight: weight,
      exercise: exercise,
    });

    // Save the leaderboard entry
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
    //TODO add admin check after merge
    try{
        const leaderboard = await Leaderboard.deleteMany({});
        res.status(204).send({leaderboard, message: "All leaderboard entries successfully deleted"});}
    catch(err){
        res.status(500).send(err);}});

exports = module.exports = router;
