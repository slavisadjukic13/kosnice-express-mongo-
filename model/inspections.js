var mongoose = require('mongoose');
var inspectionSchema = new mongoose.Schema({
    detailedInspection1: Boolean,
    detailedInspection2: Boolean,
    detailedInspection3: Boolean
});
mongoose.model('Inspection', inspectionSchema);