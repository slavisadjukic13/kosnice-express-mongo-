var mongoose = require('mongoose');

var inspectionSchema = new mongoose.Schema({
    detailedInspection1: Boolean,
    detailedInspection2: Boolean,
    detailedInspection3: Boolean
});


var hiveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    inspections: [ inspectionSchema ]
});
mongoose.model('Hive', hiveSchema);