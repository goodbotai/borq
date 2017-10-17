const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Create mock http server and listen
app.get('/facebook-profile', (req, res) => {
  res.status(200).json('Ok');
});

// Generic POST
app.post('/facebook-profile', (req, res) => {
  res.status(201).json('Created');
});

// Check for expected strucutre in Ona submission
app.post('/ona-submission', (req, res) => {
  const {
    messenger_id,
    meta,
    first_name,
    last_name } = req.body.submission;
  if (messenger_id && meta && first_name && last_name ) {
    res.status(201).json('Created');
  } else {
    res.status(400).json('bad request');
  }

});

// Create rapidpro contact
app.post('/create-contact', (req, res) => {
  res.status(201).json('Created');
});

// Check for body *and* urn *or* uuid
app.post('/update-contact', (req, res) => {
  const {body} = req;
  const {urn, uuid} =  req.query;
  if (body && urn || uuid) {
    res.status(201).json('updated');
  } else {
    res.status(400).json('bad request');
  }
});


const server = app.listen(4000);

module.exports = server;
