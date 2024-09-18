var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var achievementSchema = new Schema({
    userID: {
        type     : Schema.Types.ObjectId,
        ref      : 'users',
        required : true
    },
    description       : {type: String},
    exerciseMileStone : {
        type : Schema.Types.ObjectId,
        // Stores object id of the exercise
        ref  : 'exercises'
    },
    numOfTimesInGym : [{
        type : Schema.Types.ObjectId,
        // Stores object id of the workout log
        ref  : 'workoutlog',
    }]

})

module.exports = mongoose.model('achievements', achievementSchema);