const express = require("express");
const debug = require('debug')("app:startup");
const config = require("config");
const morgan = require('morgan');
const helmet = require('helmet');
const results = require('./routes/results');
const customers = require('./routes/customers');
const pages = require('./routes/pages');
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public/images'));
app.use('/', pages);
app.use('/api/result', results);
app.use('/api/customer', customers);
app.use((req, res, next) => {
  res.status(404).send("Sorry, page not found :(");
});

app.set("view engine", "pug");

debug("Name - ", config.get('name'));
debug("Very Secure Password - ", config.get('mail.password'));

if (app.get('env') === 'development'){
  debug("Morgan enabled");
  app.use(morgan('tiny'));
}

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`listening to port ${port}...`)});
