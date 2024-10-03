const express = require('express');
const router = express.Router();
const WorkoutLog = require('../../models/workoutLogModel.js');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const tokenSecret = process.env.JWT_SECRET;
const tokenExpireTime = process.env.JWT_EXPIRES_IN;

const app = express();
app.use(cors());
router.get('/api/v1/workoutlogs', async function(req, res){
    try {
        const allWorkoutLogs = await WorkoutLog.find({});
        const events = allWorkoutLogs.map(log => ({
            id: log._id,
            title: log.title,
            start: log.date.toISOString(),
            end: log.date.toISOString(),
            session: log.session.map(session => ({
                user: session.user,
                exercises: session.exercises.map(exercise => ({
                    exercise: exercise.exercise,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    weight: exercise.weight
                }))
            }))
        }));
        console.log(events);
        res.status(200).json(events);
    } catch(err) {
        res.status(404).send}});

router.get('/api/v1/workoutlogs/:id', async function(req, res){
    var id = req.params.id;
    try {
        const workoutLog = await WorkoutLog.findById(id);
        res.status(200).json(workoutLog);}
    catch(err) {
        res.status(404).send(err)};});

router.delete('/api/v1/workoutlogs/:id', async function(req, res) {
    var id = req.params.id;
    try{
        const workoutLog = await WorkoutLog.findByIdAndDelete(id);
        res.status(204).send({workoutLog, message: "Workout log successfully deleted"});}
    catch(err){
        res.status(404).send(err);}});

router.put('/api/v1/workoutlogs/:id', async function(req, res){
    var id = req.params.id;
    try{
        const workoutLog = await WorkoutLog.findByIdAndUpdate(id, req.body);
        res.status(200).send({workoutLog, message: "Workout log successfully updated"});}
    catch(err){
        res.status(500).send(err);}});

router.post('/api/v1/workoutlogs', async function(req, res){
    try {
        var workoutLog = new WorkoutLog({
            'title' : req.body.title,
            'date' : req.body.date,
            'session' : req.body.session});
        const savedWorkoutLog = await workoutLog.save();
        res.status(200).send(savedWorkoutLog);}
    catch(err){
        res.status(500).send(err);}});

router.delete('/api/v1/workoutlogs', async function(req, res){
    //TODO add admin check after merge
    try{
        const workoutLogs = await WorkoutLog.deleteMany({});
        res.status(204).send({workoutLogs, message: "All workout logs successfully deleted"});}
    catch(err){
        res.status(500).send(err);}});
    

exports = module.exports = router;