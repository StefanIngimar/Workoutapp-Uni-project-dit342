const e = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaderboardSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    userName: { type: Schema.Types.String, ref: 'users' },
    weight: { type: Number }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);