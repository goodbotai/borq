const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Create mock http server and listen
app.get('/facebook-profile', (req, res) => {
  res.status(200).json('Ok');
});

app.get('/get-group', (req, res) => {
  const uuid = req.query ? req.query.uuid : undefined;
  if (uuid) {
    res.status(200).json('Ok');
  } else {
    res.status(400).json('bad request');
  }
});

// Generic POST
app.post('/facebook-profile', (req, res) => {
  res.status(201).json('Created');
});

// Check for expected strucutre in Ona submission
app.post('/ona-submission', (req, res) => {
  const {
    id,
    messenger_id: psid,
    meta,
    first_name: fName,
    last_name: lName} = req.body.submission;
  if (id, psid && meta && fName && lName ) {
    res.status(201).json('Created');
  } else {
    res.status(400).json('bad request');
  }
});

// Create rapidpro contact
app.post('/create-contact', (req, res) => {
  const {urn} = req.query;
  if (urn) {
    res.status(201).json('Created');
  } else {
    const {urns} = req.body;
    if (urns) {
      res.status(201).json('Created');
    } else {
      res.status(400).json('bad request');
    }
  }
});

// Check for body *and* urn *or* uuid
app.post('/update-contact', (req, res) => {
  const {body} = req;
  const {urn, uuid} = req.query;
  if (body && urn || uuid) {
    res.status(201).json('Updated');
  } else {
    res.status(400).json('bad request');
  }
});


const server = app.listen(4000);

setTimeout(() => server.close(), 500);

module.exports = server;
