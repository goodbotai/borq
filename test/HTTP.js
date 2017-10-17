/* eslint require-jsdoc: "off" */
const http = require('../lib/HTTP.js');
const assert = require('assert');
const server = require('./server.js');

const baseURL = `http://localhost:4000`;

function testHTTP() {
  if (server.listening) {
    describe('test request', () => {
      it('retry HTTP requests with a response code >= 400');
      it('makes http requests', () => {
        http.request(`${baseURL}/facebook-profile`, {method: 'GET'})
          .then((res) => {
            assert.ok(res);
            server.close();
          });
      });
    });

  } else {
    testHTTP();
  }

}

module.exports = testHTTP;
