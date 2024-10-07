const express = require('express');
const router = express.Router();
const WorkoutLog = require('../../models/workoutLogModel.js');
const DailySession = require('../../models/dailySessionModel.js');
const cors = require('cors');
const { model } = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

router.get('/api/v1/workoutlogs', async function(req, res){
    try {
        const allWorkoutLogs = await WorkoutLog.find({})
        .populate({
            path: 'session.exercises.exercise',
            model: 'exercises'
        })
        .exec();
        console.log("Raw workout logs data:", allWorkoutLogs);
        const events = allWorkoutLogs.map(log => ({
            id: log._id,
            title: log.title,
            start: log.date.toISOString(),
            end: log.date.toISOString(),
            session: log.session.map(session => ({
                user: session.user,
                exercises: session.exercises.map(exercise => {
                    if (exercise && exercise.exercise) { // Null/undefined check
                        return {
                            exerciseId: exercise.exercise._id,
                            name: exercise.exercise.name,
                            sets: exercise.sets,
                            reps: exercise.reps,
                            weight: exercise.weight
                        };
                    } else {
                        return null; // skip if exercise data is missing
                    }
                }).filter(exercise => exercise !== null) // Filter out null values
            }))
        }));

        console.log("Transformed workout logs:", events);

        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching workout logs:', err);
        res.status(500).json({ error: 'Failed to fetch workout logs' });
    }
});

router.get('/api/v1/workoutlogs/:id', async function(req, res){
    var id = req.params.id;
    try {
        const workoutLog = await WorkoutLog.findById(id)
        .populate({
            path: 'session.exercises.exercise',
            model: 'exercises'
        })
        .exec();
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
        const workoutLog = await WorkoutLog.findByIdAndUpdate(id, req.body)
        .populate({
            path: 'session.exercises.exercise',
            model: 'exercises'
        })
        .exec();
        res.status(200).send({workoutLog, message: "Workout log successfully updated"});}
    catch(err){
        res.status(500).send(err);}});

router.post('/api/v1/workoutlogs', async function(req, res){
    try {
        const { title, date, session } = req.body;
       /* if (!title || !date || !session || session.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }*/

            

        const workoutLog = new WorkoutLog({
            title,
            date,
            session
            /*'title' : req.body.title,
            'date' : req.body.date,
            'session' : req.body.session*/});
        const savedWorkoutLog = await workoutLog.save();
        const populatedWorkoutLog = await WorkoutLog.findById(savedWorkoutLog._id)
        .populate({
            path: 'session.exercises.exercise',
            model: 'exercises'
        })
        .exec();
        console.log(req.body.session[0].user, req.body.session[0].exercises[0].exercise);
        res.status(200).send(populatedWorkoutLog);}
    catch(err){
        console.error('Error creating workout log:', err);
        res.status(500).send(err);}});

router.delete('/api/v1/workoutlogs', async function(req, res){
    //TODO add admin check after merge
    try{
        const workoutLogs = await WorkoutLog.deleteMany({});
        res.status(204).send({workoutLogs, message: "All workout logs successfully deleted"});}
    catch(err){
        res.status(500).send(err);}});
    

exports = module.exports = router;