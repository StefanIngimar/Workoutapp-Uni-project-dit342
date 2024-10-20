var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName   : {type: String, required: true},
    email      : {type: String, required: true},
    password   : {type: String, required: true},
    achievements : [{type: Schema.Types.ObjectId, ref: 'achievements'}],
    isAdmin    : {type: Boolean, default: false}
    // profilePic : {type: String} // Potentially add this later
})

module.exports = mongoose.model('users', userSchema);