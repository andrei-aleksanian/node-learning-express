const {Customer} = require('./customersModel');
const debug = require('debug')("app:CustomerDB");
const {showErrors} = require('../mongoose');

const createResult = async (customerData) => {
    try {
        const customer = new Customer(customerData);
        debug(customer);
        return await customer.save();
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't add it to database, try again later";
    }
};

const getMultipleResults = async (find=null, select=null) =>{
    try {
        return await Customer
            .find(find)
            .select(select);
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't add fetch from database, try again later";
    }
};

const getOneResult = async (id = "null") => {
    try{
        const customer = await Customer.findById(id);
        if (!customer) return "Data not found in our database";
        return customer;
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't fetch from database, try again later";
    }
};

const updateResult = async (id="null", newData={}) => {
    try{
        const customer = await Customer.findById(id);
        if (!customer) return "Data not found in our database";
        customer.set(newData);
        return await customer.save();
    } catch(ex) {
        showErrors(ex);
        return "Sorry, we couldn't update in database, try again later";
    }
};

const deleteResult = async (id="null") => {
    try{
        const customer = await Customer.findById(id);
        if (!customer) return "Data not found in our database";
        return await Customer.deleteOne({_id: id});
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
