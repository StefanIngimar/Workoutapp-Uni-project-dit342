var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const DailySession = require('../../models/dailySessionModel');
const Exercise = require('../../models/exerciseModel');
const WorkoutLog = require('../../models/workoutLogModel');

// Returns all items stored in the database.
router.get('/api/v1/dailysessions', async function (req, res) {
    try {
        const allSessions = await DailySession.find({});
        res.status(200).json(allSessions)
    } catch (err) {
        res.status(404).send(err);
    }
});

// Returns a single item stored in the database by id.
router.get('/api/v1/dailysessions/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var session = await DailySession.findById(id);
        res.status(200).json(session)
    } catch (err) {
        next();
    }
});

// Returns a all item stored in the database by query.
router.get('/api/v1/dailysessions/search', async function (req, res, next) { 
    const query = req.query; 
    try {
        const exercise = await Exercise.find(query);
        res.status(200).json(exercise);
    } catch (err) {
        res.status(404).send(err);
    }
});

// Returns all exercises stored in a dailysession by id.
router.get('/api/v1/dailysessions/:id/exercises', async function (req, res) {
    var id = req.params.id;
    try {
        var session = await DailySession.findById(id);
        res.status(200).json(session.exercises)
    } catch (err) {
        res.status(404).send(err);
    }
});

// Deletes single item by id.
router.delete('/api/v1/dailysessions/:id', async function (req, res) {
    var id = req.params.id;
    try {
        const session = await DailySession.findByIdAndDelete(id);
        res.status(200).send({ message: "Session successfully deleted" }); 
    } catch (err) {
        res.status(404).send(err);
    }
});

// Deletes all items if admin user.
router.delete('/api/v1/dailysessions/', async function (req, res) {
    var isAdmin = req.body.isAdmin;
    try {
        if(isAdmin){
            const session = await DailySession.deleteMany({});
            res.status(200).send({ message: "All session successfully deleted" }); 
        }
    } catch (err) {
        res.status(404).send(err);
    }
});


// Removes single execise from session by id.
router.patch('/api/v1/dailysessions/:sessionID', async function (req, res, next) { // Perhaps should be delete instead of patch?
    var sessionID = req.params.sessionID;
    var exerciseID = req.body.exerciseID;
    try {
        const exercise = await Exercise.findById(exerciseID);
        if (!exercise) {
            next();
            return
        }

        const session = await DailySession.findByIdAndUpdate(
            sessionID,
            { $pull: { exercises: exercise } },
            { new: true } // returns the updated version.
        );

        if (!session) {
            res.status(404).send({ message: "Daily session not found!" });
        }

        res.status(200).send({ message: "Exercise deleted successfully!", session });

    } catch (err) {
        res.status(500).send(err);
    }
});

// Updates an attribute in a daily session.
router.patch('/api/v1/dailysessions/:id', async function (req, res, next) { 
    var id = req.params.id;
    try {
        const session = await DailySession.findByIdAndUpdate(id, {
            $set: {
                sessionName: req.body.sessionName,
                duration: req.body.duration,
                isCompleted: req.body.isCompleted,
                notes: req.body.notes
            },
        },
            { new: true }); // returns the updated version.
        res.status(200).send(session);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Adds an exercise by id to a session by id.
router.patch('/api/v1/dailysessions/:sessionID/exercises', async function (req, res) { // Perhaps should be POST.
    var exerciseID = req.body.exerciseID;
    var sessionID = req.params.sessionID;

    try {
        const exercise = await Exercise.findById(exerciseID);
        if (!exercise) {
            return res.status(404).send({ message: "Exercise not found!" });
        }

        const session = await DailySession.findByIdAndUpdate(
            sessionID,
            { $push: { exercises: exercise } },
            { new: true }
        );

        if (!session) {
            return res.status(404).send({ message: "Daily session not found!" });
        }
        res.status(200).send({ message: "Exercise added", session });

    } catch (err) {
        res.status(500).send(err);
    }
});

// Creates and stores a new daily session.
router.post('/api/v1/dailysessions', async function (req, res) { // TODO: Add error handling.
    
    try {
        const { userID, sessionName, duration, isCompleted, notes, exercises } = req.body;
        const dailySession = new DailySession({
            userID,
            sessionName,
            duration,
            isCompleted,
            notes,
            exercises
        });
        const savedSession = await dailySession.save();

        const workoutLog = new WorkoutLog({
            title: sessionName,
            date: new Date(),
            session: [{
                user: userID,
                exercises: exercises.map(exercise => ({
                    exerciseName: exercise.name,
                    exercise: exercise.exercise,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    weight: exercise.weight
                }))
            }]
        });

        await workoutLog.save();
        res.status(201).json(savedSession);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Adds an exercise by id to a session by id.
router.patch('/api/v1/dailysessions/:sessionID', async function (req, res) {
    var exerciseID = req.body.exerciseID;
    var sessionID = req.params.sessionID;

    try {
        const exercise = await Exercise.findById(exerciseID);
        if (!exercise) {
            return res.status(404).send({ message: "Exercise not found!" });
        }

        const session = await DailySession.findByIdAndUpdate(
            sessionID,
            { $push: { exercises: exercise } },
            { new: true }
        );

        if (!session) {
            return res.status(404).send({ message: "Daily session not found!" });
        }
        res.status(200).send({ message: "Exercise added", session });

    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;