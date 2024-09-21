var express = require('express');
var router = express.Router();

// Import the exerciseModel i.e the exercise "object".
var Exercise = require('../../models/exerciseModel');

// Returns all items stored in the database.
router.get('/api/v1/exercises', async function (req, res) {
    try {
        const allExercises = await Exercise.find({});
        res.status(200).json(allExercises)
    } catch (err) {
        res.status(404).send(err);
    }
});

// Returns a single item stored in the database by id.
router.get('/api/v1/exercises/:id', async function (req, res, next) {
    var id = req.params.id; // Extract id from param of the GET request. 
    try {
        var exercise = await Exercise.findById(id);
        res.status(200).json(exercise)
    } catch (err) {
        next();
    }
});

// Returns a single item attribute bodypart stored in the database by id.
router.get('/api/v1/exercises/:id/bodyPart', async function (req, res, next) {
    var id = req.params.id; // Extract id from param of the GET request. 
    try {
        var exercise = await Exercise.findById(id);
        res.status(200).json(exercise.bodyPart)
    } catch (err) {
        next();
    }
});

// Returns a all item stored in the database by query.
router.get('/api/v1/exercises/search', async function (req, res, next) { 
    const query = req.query; 
    try {
        const exercise = await Exercise.find(query);
        res.status(200).json(exercise);
    } catch (err) {
        res.status(404).send(err);
    }
});

// Deletes exercise from database by id.
router.delete('/api/v1/exercises/:id', async function (req, res) {
    var id = req.params.id;
    try {
        const exercise = await Exercise.findByIdAndDelete(id);
        res.status(200).send({ message: "Exercise successfully deleted" });
    } catch (err) {
        res.status(404).send(err);
    }
});

// Deletes all items if admin user.
router.delete('/api/v1/exercises/', async function (req, res) {
    var isAdmin = req.body.isAdmin;
    try {
        if (isAdmin) {
            const session = await Exercise.deleteMany({});
            res.status(200).send({ message: "All exercises successfully deleted" });
        }
    } catch (err) {
        res.status(404).send(err);
    }
});

// Posts a new exercise to the database.
router.post('/api/v1/exercises', async function (req, res) { // TODO: Add error handling.
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
        res.status(201).json(savedExercise);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Updates attributes of item by id.
router.patch('/api/v1/exercises/:id', async function (req, res) {
    var id = req.params.id;
    try {
        if (req.body.isCustom) {
            const exercise = await Exercise.findByIdAndUpdate(id, {
                $set: {
                    name: req.body.name,
                    bodyPart: req.body.bodyPart,
                    hasWeights: req.body.hasWeights,
                    weight: req.body.weight,
                    reps: req.body.bodyPart,
                    reps: req.body.reps,
                    sets: req.body.sets
                }
            },
                { new: true }); // return new version
            res.status(200).send(exercise);
        } else {
            const exercise = await Exercise.findByIdAndUpdate(id, { // Ugly but works.
                $set: {
                    weight: req.body.weight,
                    reps: req.body.reps,
                    sets: req.body.sets
                }
            },
                { new: true }); // return new version
            res.status(200).send(exercise);
        }

    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;