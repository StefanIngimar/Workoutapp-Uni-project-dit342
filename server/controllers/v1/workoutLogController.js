const express = require('express');
const router = express.Router();
const WorkoutLog = require('../../models/workoutLogModel.js');
const Dailysession = require('../../models/dailySessionModel.js');
const Exercise = require('../../models/exerciseModel');
const cors = require('cors');
const { model } = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// router.get('/api/v1/workoutlogs', async function(req, res){
//     try {
//         const allWorkoutLogs = await WorkoutLog.find({})
//         // .populate({
//         //     path: 'session.exercises.exercise',
//         //     model: 'exercises'
//         // })
//         //.exec();
//         console.log("Raw workout logs data:", allWorkoutLogs);
//         const events = allWorkoutLogs.map(log => ({
//             id: log._id,
//             title: log.title,
//             start: log.date.toISOString(),
//             end: log.date.toISOString(),
//             session: log.session.map(session => ({
//                 user: session.user,
//                 exercises: session.exercises.map(exercise => {
//                     if (exercise && exercise.exercise) { // Null/undefined check
//                         return {
//                             exerciseId: exercise.exercise._id,
//                             name: exercise.exercise.name,
//                             sets: exercise.sets,
//                             reps: exercise.reps,
//                             weight: exercise.weight
//                         };
//                     } else {
//                         return null; // skip if exercise data is missing
//                         //this occurred after i changed the workoutlog schema and all the data was messed up
//                         //skip the missing data and continue with the rest
//                     }
//                 }).filter(exercise => exercise !== null) // Filter out null values
//             }))
//         }));

//         console.log("Transformed workout logs:", events);

//         res.status(200).json(events);
//     } catch (err) {
//         console.error('Error fetching workout logs:', err);
//         res.status(500).json({ error: 'Failed to fetch workout logs' });
//     }
// });

router.get('/api/v1/workoutlogs', async function(req, res){
    try {
        const allWorkoutLogs = await WorkoutLog.find({});
        res.status(200).json(allWorkoutLogs)
    } catch(err) {
        res.status(404).send}});

router.get('/api/v1/workoutlogs/:userID', async function(req, res){
    var userID = req.params.userID;
    try {
        const allWorkoutLogs = await WorkoutLog.find({ 'session': { $elemMatch: { userID: userID } } });
        res.status(200).json(allWorkoutLogs);
    } catch(err) {
        res.status(404).send(err);
    }
});


router.get('/api/v1/workoutlogs/:userID/:id', async function(req, res){
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
        /*.populate({
            path: 'session.exercises.exercise',
            model: 'exercises'
        })
        .exec();*/
        res.status(200).send({workoutLog, message: "Workout log successfully updated"});}
    catch(err){
        res.status(500).send(err);}});

//router.get('/api/v1/workoutlogs/:exerciseID/sessions', async function(req, res) {

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
        // console.log('WorkoutLog ID:', session);
        // console.log('Session ID:', workoutLog);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.post('/api/v1/workoutlogs', async function(req, res){
    try {
        const { title, date, session } = req.body;
        const workoutLog = new WorkoutLog({
            title,
            date: new Date(),
            session: [{ //https://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
                //wanted to link the user and exercise to the workout log
                //for the frontend to be able to display the user and exercise name
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
       /* const populatedWorkoutLog = await WorkoutLog.findById(savedWorkoutLog._id)
        .populate({
            path: 'session.exercises.exercise',
            model: 'exercises'
        })
        .exec();*/
        res.status(200).send(savedWorkoutLog);}
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
