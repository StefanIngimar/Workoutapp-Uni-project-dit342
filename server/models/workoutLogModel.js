var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*var workoutLogSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    session: [{
        user: { type: Schema.Types.ObjectId, ref: 'users' },
        exercises:[{
        exercise: { type: Schema.Types.ObjectId, ref: 'exercises' },
        sets: { type: Number },
        reps: { type: Number },
        weight: { type: Number }
    }]
    }]
});*/
var workoutLogSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    session: []
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);