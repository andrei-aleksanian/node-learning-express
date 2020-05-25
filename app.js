const express = require("express");
const startupDebugger = require('debug')("app:startup");
const dbDebugger = require('debug')("app:db");
const config = require("config");
const morgan = require('morgan');
const helmet = require('helmet');
const results = require('./routes/results');
const pages = require('./routes/pages');
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public/images'));
app.use('/api/result', results);
app.use('/', pages)

app.set("view engine", "pug");

startupDebugger("Name - ", config.get('name'));
startupDebugger("Very Secure Password - ", config.get('mail.password'));
if (app.get('env') === 'development'){
  startupDebugger("Morgan enabled");
  app.use(morgan('tiny'));
}
dbDebugger("Connecting to MongoDB...");

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`listening to port ${port}...`)});
