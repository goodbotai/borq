const express = require('express');

const app = express();

// Create mock http server and listen
app.get('/facebook-profile', function(req, res) {
  res.status(200).json({ name: 'tobi' });
});

const server = app.listen(4000);

module.exports = server;
