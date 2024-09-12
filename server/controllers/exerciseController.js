var express = require('express');
var router = express.Router();

// Import the exerciseModel i.e the exercise "object".
var Exercise = require('../models/exerciseModel');

// Returns all items stored in the database.
router.get('/api/exercises', async function(req, res){
    try {
        const allExercises = await Exercise.find({});
        res.status(200).json(allExercises)
    } catch(err) {
        res.status(404).send(err);
    }
});

// Returns a single item stored in the database by id.
router.get('/api/exercises/:id', async function(req, res, next){
    var id = req.params.id; // Extract id from param of the GET request. 
    try {
        var exercise = await Exercise.findById(id);
        res.status(200).json(exercise)
    } catch(err) {
        next();
    }
});

// Returns a all item stored in the database by bodyPart.
router.get('/api/exercises/:bodyPart', async function(req, res){
    var bodyPart = req.params.bodyPart; // Extract id from param of the GET request. 
    try {
        const exercise = await Exercise.find({bodyPart: bodyPart});
        res.status(200).json(exercise);
    } catch(err) {
        res.status(404).send(err);
    }
});

// Deletes exercise from database by id.
router.delete('/api/exercises/:id', async function(req, res) {
    var id = req.params.id;
    try{
        const exercise = await Exercise.findByIdAndDelete(id);
        res.status(200).send({message: "Exercise successfully deleted"});
    } catch(err){
        res.status(500).send(err);
    }
});

// Posts a new exercise to the database.
router.post('/api/exercises', async function(req, res){ // TODO: Add error handling.
    var exercise = new Exercise({
        'name' : req.body.name,
        'hasWeights' : req.body.hasWeights,
        'bodyPart' : req.body.bodyPart,
        'isCustom' : req.body.isCustom,
        'reps' : req.body.reps,
        'sets' : req.body.sets
    });

    try {
        const savedExercise = await exercise.save();
        res.status(201).json(savedExercise);
      } catch (err) {
        res.status(500).send(err);
      }
});

// Updates attributes of item by id.
router.patch('/api/exercises/:id', async function(req, res){
    var id = req.params.id;
    try{
        if(req.body.isCustom){
            const exercise = await Exercise.findByIdAndUpdate(id,{ 
                $set: { 
                name: req.body.name,
                hasWeights: req.body.hasWeights,
                reps: req.body.bodyPart,
                isCustom: req.body.isCustom,
                reps: req.body.reps,
                sets: req.body.sets}
            },
            {new: true}); // return new version
            res.status(201).send(exercise);
        } else {
            const exercise = await Exercise.findByIdAndUpdate(id,{ // Ugly but works.
                $set: { 
                    reps: req.body.reps,
                    sets: req.body.sets}
            },
            {new: true}); // return new version
            res.status(201).send(exercise);
        }

    } catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;