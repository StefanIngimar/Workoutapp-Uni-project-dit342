var express = require('express');
var router = express.Router();

var WorkoutLog = require('../models/workoutLogModel');

router.get('/api/workoutlogs', async function(req, res){
    try {
        const allWorkoutLogs = await WorkoutLog.find({});
        res.status(200).json(allWorkoutLogs)
    } catch(err) {
        res.status(404).send}});

router.get('/api/workoutlogs/:id', async function(req, res){
    var id = req.params.id;
    try {
        const workoutLog = await WorkoutLog.findById(id);}
    catch(err) {
        res.status(404).send(err)};});

router.delete('/api/workoutlogs/:id', async function(req, res) {
    var id = req.params.id;
    try{
        const workoutLog = await WorkoutLog.findByIdAndDelete(id);
        res.status(200).send({message: "Workout log successfully deleted"});}
    catch(err){
        res.status(500).send(err);}});

router.put('/api/workoutlogs/:id', async function(req, res){
    var id = req.params.id;
    try{
        const workoutLog = await WorkoutLog.findByIdAndUpdate(id, req.body);}
    catch(err){
        res.status(500).send(err);}});

router.post('/api/workoutlogs/newworkoutlog', async function(req, res){
    
    var workoutLog = new WorkoutLog({
        'date' : req.body.date,
        'exercises' : req.body.exercises});
    try {
        const savedWorkoutLog = await workoutLog.save();
        res.status(200).send(savedWorkoutLog);}
    catch(err){
        res.status(500).send(err);}});
    

module.exports = router;