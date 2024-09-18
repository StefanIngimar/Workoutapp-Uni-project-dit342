var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// Create a exercise using mongoose schema.
var exerciseSchema = new Schema({
    name       : {type: String},
    hasWeights : {type: Boolean},
    weight     : {type: Number},
    bodyPart   : {type: String}, 
    isCustom   : {type: Boolean},
    reps       : {type: Number}, 
    sets       : {type: Number} 
});

module.exports = mongoose.model('exercises', exerciseSchema);