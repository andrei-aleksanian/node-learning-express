const express = require('express');
const router = express.Router();
const Joi = require('joi');
const debug = require('debug')("app:Results API");

const db = require('../resultDB/resultDB');

const validateInputResult = (result) => {
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        output: Joi.string().min(3).max(255).required()
    };

    return Joi.validate(result, schema);
};

router.get('', (req, response) => {
    db.getAllResults()
        .then(result => response.send(result))
        .catch(result => {
            debug("[caught] couldn't fetch from database");
            response.send(result);
        });
});

router.get('/:id', (req, response) => {
    const resultId = req.params.id;

    db.getAllResults({_id: resultId})
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
    const {error} = validateInputResult(req.body);

    if (error) return response.status(400).send(error.details[0].message);

    const name = req.body.name;
    const output = req.body.output;


    db.createResult(name, output)
        .then(result => response.send(result))
        .catch(result => {
            debug("[caught] couldn't push to database");
            response.send(result);
        });
});

router.put('/:id', (req, res) => {
    const resultId = req.params.id;
    let result = fetchResultById(resultId);
    const {error} = validateInputResult(req.body);

    if (!result) return res.status(404).send(`The given result with id ${resultId} was not found`)
    if (error) return res.status(400).send(error.details[0].message);

    const resultIn = {
        id: resultId,
        output: req.body.output
    };

    result.output = resultIn.output;
    res.send(result);
});

router.delete('/:id', (req, res) => {
    const resultId = req.params.id;
    let result = fetchResultById(resultId);

    if (!result) return res.status(404).send(`The given result with id ${resultId} was not found`);

    const index = results.indexOf(result);
    results.splice(index, 1);
    res.send(result);
});

module.exports = router;
