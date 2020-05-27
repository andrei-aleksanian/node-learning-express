const {Result} = require('./resultModel');
const debug = require('debug')("app:ResultDB");
const {showErrors} = require('../mongoose');

const createResult = async (resultData) => {
    try {
        const result = new Result(resultData);
        debug(result);
        return await result.save();
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't add it to database, try again later";
    }
};

const getMultipleResults = async (find=null, select=null) =>{
    try {
        return await Result
            .find(find)
            .select(select);
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't add fetch from database, try again later";
    }
};

const getOneResult = async (id = "null") => {
    try{
        const result = await Result.findById(id);
        if (!result) return "Data not found in our database";
        return result;
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't fetch from database, try again later";
    }
};

const updateResult = async (id="null", newData={}) => {
    try{
        const result = await Result.findById(id);
        if (!result) return "Data not found in our database";
        result.set(newData);
        return await result.save();
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't update in database, try again later";
    }
};

const deleteResult = async (id="null") => {
    try{
        const result = await Result.findById(id);
        if (!result) return "Data not found in our database";
        return await Result.deleteOne({_id: id});
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't delete the item, try again later";
    }
};

module.exports.createResult = createResult;
module.exports.getMultipleResults = getMultipleResults;
module.exports.getOneResult = getOneResult;
module.exports.updateResult = updateResult;
module.exports.deleteResult = deleteResult;
