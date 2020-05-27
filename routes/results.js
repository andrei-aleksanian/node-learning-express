const express = require('express');
const router = express.Router();
const Joi = require('joi');
const debug = require('debug')("app:Results API");

const ResultMethods = require('../mongoDB/resultDB/resultMethods');

const validateInputResult = (result) => {
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        output: Joi.string().min(3).max(255).required()
    };
    return Joi.validate(result, schema);
};

router.get('', (req, response) => {
    ResultMethods.getMultipleResults()
        .then(result => response.send(result))
        .catch(result => {
            debug("[caught] couldn't fetch from database");
            response.send(result);
        });
});

router.get('/:id', (req, response) => {
    const resultId = req.params.id;

    ResultMethods.getOneResult(resultId)
        .then(result => {
            if (!result) return response.status(404).send(`The given result with id ${resultId} was not found`)
            response.send(result);
        })
        .catch(result => {
            debug("[caught] couldn't fetch from database");
            response.send(result);
        });
});

router.post('', (req, response) => {
    const data = req.body;
    const {error} = validateInputResult(data);

    if (error) return response.status(400).send(error.details[0].message);

    ResultMethods.createResult(data)
        .then(result => response.send(result))
        .catch(result => {
            debug("[caught] couldn't push to database");
            response.send(result);
        });
});

router.put('/:id', (req, response) => {
    const resultId = req.params.id;
    const {error} = validateInputResult(req.body);

    if (error) return response.status(400).send(error.details[0].message);

    const data = req.body;

    ResultMethods.updateResult(resultId, data)
        .then(result => response.send(result))
        .catch(err => {
            debug("[caught] couldn't update in database");
            response.send(err);
        });
});

router.delete('/:id', (req, response) => {
    const resultId = req.params.id;

    ResultMethods.deleteResult(resultId)
        .then(result => response.send(result === "Data not found in our database" ? result : "Your item has been successfully deleted!"))
        .catch(err => {
            debug("[caught] couldn't delete in database");
            response.send(err);
        });
});

module.exports = router;
