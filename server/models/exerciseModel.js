var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// Create a exercise using mongoose schema.
var exerciseSchema = new Schema({
    name : {type: String},
    hasWeights : {type: Boolean},
    weight : {type: Number},
    bodyPart : {type: String}, // Might have to create an enum.
    isCustom : {type: Boolean},
    reps : {type: Number}, // Perhaps just have number be 0.
    sets : {type: Number} // Perhaps just have number be 0.
});

module.exports = mongoose.model('exercises', exerciseSchema);