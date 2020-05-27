const {mongoose} = require('../mongoose');

const resultsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    output: {
        type: Number,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    steps: {type: [String], default: 'Done in one step'},
    date: {type: Date, default: Date.now}
});

const Result = mongoose.model('Results', resultsSchema);

module.exports.Result = Result;
