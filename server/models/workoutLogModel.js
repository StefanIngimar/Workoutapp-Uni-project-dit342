var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var workoutLogSchema = new Schema({
    date: { type: Date, required: true },
    exercises: [{
        exercise: { type: Schema.Types.ObjectId, ref: 'exercises' },
        sets: { type: Number },
        reps: { type: Number },
        weight: { type: Number }
    }]
});