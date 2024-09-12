const e = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaderboardSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    workoutLog: { type: Schema.Types.ObjectId, ref: 'workoutLogModel' }
});
//need to fix this and get the actual weight instead of the entire object

module.exports = mongoose.model('Leaderbord', leaderboardSchema);