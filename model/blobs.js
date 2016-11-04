var mongoose = require('mongoose');
var blobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    badge: Number,
    dob: { type: Date, default: Date.now, required: true },
    isloved: Boolean
});
mongoose.model('Blob', blobSchema);