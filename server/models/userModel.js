var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName   : {type: String, required: true},
    email      : {type: String, required: true},
    password   : {type: String, required: true},
    profilePic : {type: String} 
})

module.exports = mongoose.model('users', userSchema);