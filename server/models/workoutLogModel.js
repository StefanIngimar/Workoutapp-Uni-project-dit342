var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var workoutLogSchema = new Schema({
    date: { type: Date, required: true },
    session: [{
        //exercise: { type: Schema.Types.ObjectId, ref: 'exercises' },
        exercise: { type: String},
        sets: { type: Number },
        reps: { type: Number },
        weight: { type: Number }
    }]
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);