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
router.get('/api/exercises/:id', async function(req, res){
    var id = req.params.id; // Extract id from param of the GET request. 
    try {
        const exercise = await Exercise.findById(id);
        res.status(200).json(exercise)
    } catch(err) {
        res.status(404).send(err);
    }
});

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
router.post('/api/exercises/newexercise', async function(req, res){ // TODO: Add error handling.
    // var name = req.params.name;
    // try {
    //     const exercise = await Exercise.findOne({name : name});
    //     if(exercise)
    //     {
    //         res.status(409).send("Exercise already exists!");
    //     }
    // }
    
    var exercise = new Exercise({
        'name' : 'Barbell Benchpress',
        'hasWeights' : true,
        'bodyPart' : 'Chest',
        'isCustom' : false,
        'reps' : 10,
        'sets' : 4
    });

    try {
        const savedExercise = await exercise.save();
        res.status(201).json(savedExercise);
      } catch (err) {
        res.status(500).send(err);
      }
});

module.exports = router;