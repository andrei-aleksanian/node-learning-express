const express = require('express');
const router = express.Router();
const Joi = require('joi');
const debug = require('debug')("app:Customers API");

const CustomersMethods = require('../mongoDB/customersDB/customersMethods');

const validateInputResult = (customer) => {
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        phone: Joi.string().required(),
        isGold: Joi.boolean().required()
    };
    return Joi.validate(customer, schema);
};

router.get('', (req, response) => {
    CustomersMethods.getMultipleResults()
        .then(customer => response.send(customer))
        .catch(customer => {
            debug("[caught] couldn't fetch from database");
            response.send(customer);
        });
});

router.get('/:id', (req, response) => {
    const customerID = req.params.id;

    CustomersMethods.getOneResult(customerID)
        .then(customer => {
            if (!customer) return response.status(404).send(`The given result with id ${resultId} was not found`)
            response.send(customer);
        })
        .catch(customer => {
            debug("[caught] couldn't fetch from database");
            response.send(customer);
        });
});

router.post('', (req, response) => {
    const data = req.body;
    const {error} = validateInputResult(data);

    if (error) return response.status(400).send(error.details[0].message);

    CustomersMethods.createResult(data)
        .then(customer => response.send(customer))
        .catch(customer => {
            debug("[caught] couldn't push to database");
            response.send("Please fill in all the fields correctly");
        });
});

router.put('/:id', (req, response) => {
    const customerID = req.params.id;
    const {error} = validateInputResult(req.body);

    if (error) return response.status(400).send(error.details[0].message);

    const data = req.body;

    CustomersMethods.updateResult(customerID, data)
        .then(customer => response.send(customer))
        .catch(err => {
            debug("[caught] couldn't update in database");
            response.send("Please fill in all the fields correctly");
        });
});

router.delete('/:id', (req, response) => {
    const customerID = req.params.id;

    CustomersMethods.deleteResult(customerID)
        .then(customer => response.send(customer === "Data not found in our database" ? customer : "Your item has been successfully deleted!"))
        .catch(err => {
            debug("[caught] couldn't delete in database");
            response.send(err);
        });
});

module.exports = router;
