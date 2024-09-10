var express = require('express');
var router = express.Router();

var DailySession = require('../models/dailySessionModel');

// Returns all items stored in the database.
router.get('/api/dailysessions', async function(req, res){
    try {
        const allSessions = await DailySession.find({});
        res.status(200).json(allSessions)
    } catch(err) {
        res.status(404).send(err);
    }
});

// Returns a single item stored in the database by id.
router.get('/api/dailysessions/:id', async function(req, res, next){
    var id = req.params.id; 
    try {
        var session = await DailySession.findById(id);
        res.status(200).json(session)
    } catch(err) {
        next();
    }
});

// Returns a all item stored in the database by sessionName.
router.get('/api/dailysessions/:sessionName', async function(req, res){
    var sessionName = req.params.sessionName;  
    try {
        const session = await DailySession.find({sessionName: sessionName});
        res.status(200).json(session);
    } catch(err) {
        res.status(404).send(err);
    }
});

// Deletes single item by id.
router.delete('/api/dailysessions/:id', async function(req, res) {
    var id = req.params.id;
    try{
        const session = await DailySession.findByIdAndDelete(id);
        res.status(200).send({message: "Session successfully deleted"});
    } catch(err){
        res.status(500).send(err);
    }
});

// Creates and stores a new daily session.
router.post('/api/dailysessions', async function(req, res){ // TODO: Add error handling.
    var dailySession = new DailySession({
        'userID' : 'getUserSomehow',
        'sessionName' : 'Push Day',
        'duration' : '60',
        'isCompleted' : false,
        'notes' : 10,
        'exercises' : []
    });

    try {
        const savedSession = await dailySession.save();
        res.status(201).json(savedSession);
      } catch (err) {
        res.status(500).send(err);
      }
});

router.patch('/api/dailysessions/:id', async function(req, res){
    var id = req.params.id;
    try{
        const session = await DailySession.findByIdAndUpdate(id,{ $set: { duration: 3 }} );
        res.status(201).send(session);
    } catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;