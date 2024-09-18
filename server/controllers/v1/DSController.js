var express = require('express');
var router = express.Router();

const DailySession = require('../../models/dailySessionModel');
const Exercise = require('../../models/exerciseModel');

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

// Returns a all item stored in the database by sessionName.
router.get('/api/v1/dailysessions/:sessionName', async function (req, res) {
    var sessionName = req.params.sessionName;
    try {
        const session = await DailySession.find({ sessionName: sessionName });
        res.status(200).json(session);
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
router.patch('/api/v1/dailysessions/:id', async function (req, res) {
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

// Creates and stores a new daily session.
router.post('/api/v1/dailysessions', async function (req, res) { // TODO: Add error handling.
    var dailySession = new DailySession({
        'userID': 'getUserSomehow', // TODO: When user is implemented.
        'sessionName': req.body.sessionName,
        'duration': req.body.duration,
        'isCompleted': req.body.isCompleted,
        'notes': req.body.notes,
        'exercises': []
    });

    try {
        const savedSession = await dailySession.save();
        res.status(201).json(savedSession);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Adds an exercise by id to a session by id.
router.put('/api/v1/dailysessions/:sessionID', async function (req, res) { // TODO: Check for duplicates. Also might be post instead of put..
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