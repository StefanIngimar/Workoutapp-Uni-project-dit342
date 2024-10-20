var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var achievementSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    exercisename: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    typeOfAchievement: {
        type: String,
        enum: ['weightLiftedMilestone', 'attendanceMilestone', 'repetitionMilestone']
    },
    milestones: {
        type: Schema.Types.Mixed,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    dateCompleted: {
        type: Date
    }
}, {
    minimize: false,
    toJSON: { minimize: false },
    toObject: { minimize: false }
});

module.exports = mongoose.model('achievements', achievementSchema);
