const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/playground', {
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log("db connected..."))
    .catch(() => console.log("db not connected something went wrong..."));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const resultsSchema = new mongoose.Schema({
    name: String,
    output: Number,
    steps: {type: [String], default: 'Done in one step'},
    date: {type: Date, default: Date.now},
    isPublished: Boolean
});

const Result = mongoose.model('Results', resultsSchema);

const createResult = async () => {
    const result = new Result({
        name: "1",
        output: 1,
        isPublished: true
    });
    return await result.save();
};

createResult()
    .then(res => console.log(res))
    .catch();