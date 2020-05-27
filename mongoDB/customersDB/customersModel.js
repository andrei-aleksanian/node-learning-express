const {mongoose} = require('../mongoose');
const debug = require('debug')("app:Customers DB");
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const {showErrors} = require('../mongoose');

const customersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        validate:{
            validator: (v) => {
                let number;
                try{
                    number = phoneUtil.parseAndKeepRawInput(v, 'UK');
                    return phoneUtil.isValidNumber(number);
                } catch (ex) {
                    showErrors(ex);
                    return false;
                }
            },
            message: "Please input correct UK phone number"
        }
    },
    isGold: {
        type: Boolean,
        required: true
    }
});

const Customer = mongoose.model('Customers', customersSchema);

module.exports.Customer = Customer;
