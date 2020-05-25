const express = require('express');
const router = express.Router();
const Joi = require('joi');

const results = [
    {id: 1, output: "hello"},
    {id: 2, output: "hola"},
    {id: 3, output: "bonjour"},
];

const validateInputResult = (result) => {
    const schema = {
        output: Joi.string().min(3).max(10).required()
    };

    return Joi.validate(result, schema);
};

const fetchResultById = (id) => {
    return results.find(r => r.id === parseInt(id));
};

router.get('', (req, res) => {
    res.send({
        results: results,
        flag1: "yayyyee"
    });
});

router.get('/:id', (req, res) => {
    const resultId = req.params.id;
    const result = fetchResultById(resultId);

    if (!result) return res.status(404).send(`The given result with id ${resultId} was not found`)
    res.send(result);
});

router.post('', (req, res) => {
    const {error} = validateInputResult(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const resultIn = {
        id: results.length + 1,
        output: req.body.output
    };

    results.push(resultIn);
    res.send(resultIn);
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
