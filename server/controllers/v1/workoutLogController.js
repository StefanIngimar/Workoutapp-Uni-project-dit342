const express = require('express');
const router = express.Router();
const WorkoutLog = require('../../models/workoutLogModel.js');
const Dailysession = require('../../models/dailySessionModel.js');
const Exercise = require('../../models/exerciseModel');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
//get all the logs
router.get('/api/v1/workoutlogs', async function(req, res){
    try {
        const allWorkoutLogs = await WorkoutLog.find({});
        res.status(200).json(allWorkoutLogs)
    } catch(err) {
        res.status(404).send}});
//Get logs by user id
router.get('/api/v1/workoutlogs/:userID', async function(req, res){
    var userID = req.params.userID;
    try {
        const allWorkoutLogs = await WorkoutLog.find({ 'session': { $elemMatch: { userID: userID } } });
        res.status(200).json(allWorkoutLogs);
    } catch(err) {
        res.status(404).send(err);
    }
});
//get a specific log from a userID. using the log id as well
router.get('/api/v1/workoutlogs/:userID/:id', async function(req, res){
    var id = req.params.id;
    try {
        const workoutLog = await WorkoutLog.findById(id)
        res.status(200).json(workoutLog);}
    catch(err) {
        res.status(404).send(err)};});
//delete a specific log
router.delete('/api/v1/workoutlogs/:id', async function(req, res) {
    var id = req.params.id;
    try{
        const workoutLog = await WorkoutLog.findByIdAndDelete(id);
        res.status(204).send({workoutLog, message: "Workout log successfully deleted"});}
    catch(err){
        res.status(404).send(err);}});
//update a specific log
router.put('/api/v1/workoutlogs/:id', async function(req, res){
    var id = req.params.id;
    try{
        const workoutLog = await WorkoutLog.findByIdAndUpdate(id, req.body)
        if(!req.body.date){res.status(400).send({message: "Date is required"});}
        if(!req.body.title){res.status(400).send({message: "Title is required"});}
        if(!req.body.session){res.status(400).send({message: "Session is required"});}
        res.status(200).send({workoutLog, message: "Workout log successfully updated"});}
    catch(err){
        res.status(500).send(err);}});
//update a specific log within the daily session. e.g. when the user adds a new exercise to their session, it updates the workout log as well
 router.put('/api/v1/workoutLogs/:workoutLogID/dailysessions/:sessionID', async function (req, res) {
     var workoutLogID = req.params.workoutLogID;
     var sessionID = req.params.sessionID;
     try {
         const session = await Dailysession.findById(sessionID);
         if (!session) {
             return res.status(404).send({ message: "Session not found!" });
         }

         const workoutLog = await WorkoutLog.findById(
             workoutLogID
         );

         if (!workoutLog) {
             return res.status(404).send({ message: "Workoutlog not found!" });
         }
            workoutLog.session = session;
            await workoutLog.save();
            res.status(200).send(workoutLog);
         // console.log('WorkoutLog ID:', session);
         // console.log('Session ID:', workoutLog);
     } catch (err) {
         res.status(500).send(err);
     }
 })
//the workout logs are also created in the dailysessioncontroller
//this one isnt really used in the client since we wanted to make it easier for the user
//to log workouts.
router.post('/api/v1/workoutlogs', async function(req, res){
    try {
        const { title, date, session } = req.body;
        const workoutLog = new WorkoutLog({
            title,
            date: new Date(),
            session: [{
                user: req.body.session[0].user,
                exercises: session[0].exercises.map(exercise => ({
                    exerciseName: exercise.name,
                    exercise: exercise.exercise,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    weight: exercise.weight
                }))
            }]
        });
        const savedWorkoutLog = await workoutLog.save();
        res.status(200).send(savedWorkoutLog);}
    catch(err){
        console.error('Error creating workout log:', err);
        res.status(500).send(err);}});
//delete all logs
router.delete('/api/v1/workoutlogs', async function(req, res){
    try{
        const workoutLogs = await WorkoutLog.deleteMany({});
        res.status(204).send({workoutLogs, message: "All workout logs successfully deleted"});}
    catch(err){
        res.status(500).send(err);}});
    

exports = module.exports = router;
