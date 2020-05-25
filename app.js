const express = require("express");
const startupDebugger = require('debug')("app:startup");
const dbDebugger = require('debug')("app:db");
// const urlEncoder = require('')
const config = require("config");
const Joi = require('joi');
const morgan = require('morgan');
const app = express();

app.use(express.json());

startupDebugger("Name - ", config.get('name'));
startupDebugger("Very Secure Password - ", config.get('mail.password'));
if (app.get('env') === 'development'){
  startupDebugger("Morgan enabled");
  app.use(morgan('tiny'));
}

dbDebugger("Connecting to MongoDB...");

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

app.get('/', (req, res) => {
  res.send("Hello world");
});

app.get('/api/result', (req, res) => {
  res.send({
    results: results,
    flag1: "yayyyee"
  });
});

app.get('/api/result/:id', (req, res) => {
  const resultId = req.params.id;
  const result = fetchResultById(resultId);

  if (!result) return res.status(404).send(`The given result with id ${resultId} was not found`)
  res.send(result);
});

app.post('/api/result', (req, res) => {
  const {error} = validateInputResult(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const resultIn = {
    id: results.length + 1,
    output: req.body.output
  };

  results.push(resultIn);
  res.send(resultIn);
});


app.put('/api/result/:id', (req, res) => {
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

app.delete('/api/result/:id', (req, res) => {
  const resultId = req.params.id;
  let result = fetchResultById(resultId);

  if (!result) return res.status(404).send(`The given result with id ${resultId} was not found`);

  const index = results.indexOf(result);
  results.splice(index, 1);
  res.send(results);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`listening to port ${port}...`)});
