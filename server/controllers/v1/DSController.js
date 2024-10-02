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

// Returns a all item stored in the database by query.
router.get('/api/v1/dailysessions/search', async function (req, res, next) {
    const query = req.query;

    const searchQuery = {};

    for (const key in query) {
        if (query.hasOwnProperty(key)) {

            searchQuery[key] = { $regex: query[key], $options: 'i' };
        }
    }
    try {
        const session = await DailySession.find(searchQuery);
        res.status(200).json(session);
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

// Returns an exercise stored in a dailysession by id.
router.get('/api/v1/dailysessions/:id/exercises/:id2', async function (req, res) {
    var id = req.params.id;
    var id2 = req.params.id2;
    try {
        var session = await DailySession.findById(id);
        if (!session) {
            return res.status(404).send({ message: "No such session" });
        }
        var exercise = await Exercise.findById(id2);
        if (!exercise) {
            return res.status(404).send({ message: "No such exercise" });
        }
        const matchedEx = session.exercises.find(ex => (ex._id.toString() === id2));
        if (matchedEx) {
            return res.status(200).send(matchedEx);
        } else {
            return res.status(404).send({ message: "Exercise not in session" });
        }

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
        if (isAdmin) {
            const session = await DailySession.deleteMany({});
            res.status(200).send({ message: "All session successfully deleted" });
        }
    } catch (err) {
        res.status(404).send(err);
    }
});


// Removes single exercise from session by id.
router.patch('/api/v1/dailysessions/:sessionID', async function (req, res, next) {
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
router.patch('/api/v1/dailysessions/:sessionID/exercises', async function (req, res) {
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

// Adds an updates an exercise by id to a session by id.
router.put('/api/v1/dailysessions/:sessionID/exercises/:exerciseID', async function (req, res) {
    var exerciseID = req.params.exerciseID;
    var sessionID = req.params.sessionID;

    try {
        const exercise = await Exercise.findByIdAndUpdate(exerciseID, req.body, { new: true });
        if (!exercise) {
            return res.status(404).send({ message: "Exercise not found!" });
        }

        const session = await DailySession.findById(
            sessionID
        );

        if (!session) {
            return res.status(404).send({ message: "Daily session not found!" });
        }

        const exerciseIndex = session.exercises.findIndex(ex => ex._id.toString() === exerciseID);

        session.exercises[exerciseIndex] = exercise; 

        await session.save();

        res.status(200).send({ message: "Exercise added", session });

    } catch (err) {
        res.status(500).send(err);
    }
});

// Deletes an exercise by id to a session by id.
router.delete('/api/v1/dailysessions/:sessionID/exercises/:exerciseID', async function (req, res) {
    var exerciseID = req.params.exerciseID
    var sessionID = req.params.sessionID;
    try {
        const session = await DailySession.findById(sessionID);

        if (!session) {
            return res.status(404).send({ message: "Daily session not found!" });
        }

        const exercise = await Exercise.findByIdAndDelete(exerciseID);
        if (!exercise) {
            return res.status(404).send({ message: "Exercise not found!" });
        }

        res.status(200).send({ message: "Exercise deleted", session });

    } catch (err) {
        res.status(500).send(err);
    }
});

// Creates and stores a new daily session.
router.post('/api/v1/dailysessions', async function (req, res) { // TODO: Add error handling.
    var dailySession = new DailySession({
        'userID': req.body.userID,
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

// Adds an exercise to a session by id.
router.post('/api/v1/dailysessions/:sessionID/exercises', async function (req, res) {
    var sessionID = req.params.sessionID;

    if (req.body.hasWeights) {
        var exercise = new Exercise({
            'name': req.body.name,
            'hasWeights': req.body.hasWeights,
            'weight': req.body.weight,
            'bodyPart': req.body.bodyPart,
            'isCustom': req.body.isCustom, // By default (for users) should be true?
            'reps': req.body.reps,
            'sets': req.body.sets
        });
    } else {
        var exercise = new Exercise({
            'name': req.body.name,
            'hasWeights': req.body.hasWeights,
            'bodyPart': req.body.bodyPart,
            'isCustom': req.body.isCustom,
            'reps': req.body.reps,
            'sets': req.body.sets
        });
    }

    try {
        const savedExercise = await exercise.save();
        const session = await DailySession.findByIdAndUpdate(
            sessionID,
            { $push: { exercises: savedExercise } },
            { new: true }
        );

        if (!session) {
            return res.status(404).send({ message: "Daily session not found!" });
        }
        res.status(201).send({ message: "Exercise added", session });

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