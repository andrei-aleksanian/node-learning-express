const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/result', {
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log("db connected..."))
    .catch(() => console.log("db not connected, something went wrong..."));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const showErrors = ex => {
    for (let field in ex.errors)
        debug(ex.errors[field].message);
};

module.exports.mongoose = mongoose;
module.exports.db = db;
module.exports.showErrors = showErrors;
