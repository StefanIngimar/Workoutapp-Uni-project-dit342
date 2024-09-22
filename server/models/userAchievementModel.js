var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userAchievementSchema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: 'users'},
    achievement : {type: Schema.Types.ObjectId, ref: 'achievements'},
    isCompleted : {type : Boolean, default : false},
    dateCompleted : {type : Date}
})

module.exports = mongoose.model('userAchievements', userAchievementSchema);
