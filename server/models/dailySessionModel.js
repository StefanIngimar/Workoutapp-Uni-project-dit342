var mongoose = require('mongoose');
const exerciseModel = require('./exerciseModel');
var Schema = mongoose.Schema;

// Create a exercise using mongoose schema.
var dailySessionSchema = new Schema({
    userID      : {type: String}, 
    sessionName : {type: String},
    duration    : {type: Number}, 
    isCompleted : {type: Boolean},
    notes       : {type: String}, 
    exercises   : [] 
});

module.exports = mongoose.model('dailySessions', dailySessionSchema);