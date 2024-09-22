var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// var achievementSchema = new Schema({
//     userID: {
//         type     : Schema.Types.ObjectId,
//         ref      : 'users',
//         required : true
//     },
//     description       : {type: String},
//     exerciseMilestone : {
//         type : Schema.Types.ObjectId,
//         // Stores object id of the exercise
//         ref  : 'exercises'
//     },
//     numOfTimesInGym : [{
//         type : Schema.Types.ObjectId,
//         // Stores object id of the workout log
//         ref  : 'workoutlog',
//     }]

// })

var achievementSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    typeOfAchievement : {type : String, enum : ['weightLiftedMilestone', 'attendanceMilestone', 'repetitionMilestone']},
    Milestones : {
        weightLiftedMilestone : {
            exercise : {type: Schema.Types.ObjectId, ref: 'exercises'},
            weight : {type : Number}
        },
        attendanceMilestone : {
            numOfTimesInGym : {type : Number}
        },
        repetitionMilestone :{
            exercise : {type: Schema.Types.ObjectId, ref: 'exercises'},
            reps : {type : Number}
        },
    }
})

module.exports = mongoose.model('achievements', achievementSchema);