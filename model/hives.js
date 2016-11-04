var mongoose = require('mongoose');

var inspectionSchema = new mongoose.Schema({
    detailedInspection1: Boolean,
    detailedInspection2: Boolean,
    detailedInspection3: Boolean
});

//TODO check this out - nested population

// http://mongoosejs.com/docs/api.html#model_Model.populate
// http://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose

var hiveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    inspections: [ inspectionSchema ]
});
mongoose.model('Hive', hiveSchema);