const mongoose = require('mongoose');
const debug = require('debug')("app:db");

mongoose.connect('mongodb://localhost/result', {
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log("db connected..."))
    .catch(() => console.log("db not connected, something went wrong..."));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

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


const showErrors = ex => {
    for (let field in ex.errors)
        debug(ex.errors[field].message);
};

const createResult = async (name = "name", output = 0) => {
    const result = new Result({
        name: name,
        output: output
    });
    try {
        debug(result);
        return await result.save();
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't add it to database, try again later";
    }
};

const getAllResults = async (find=null, select=null) =>{
    try {
        return await Result
            .find(find)
            .select(select);
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't add fetch from database, try again later";
    }
};

const getResult = async (id = "null") =>{
    try{
        return await Result.findById(id);
    } catch(err) {
        return err.message;
    }
};

module.exports.createResult = createResult;
module.exports.getAllResults = getAllResults;
