/* eslint require-jsdoc: "off" */
const http = require('../lib/HTTP.js');
const assert = require('assert');
const server = require('./server.js');

const baseURL = `http://localhost:4000`;

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();


function testHTTP() {
  describe('test request', () => {
      it('retry HTTP requests with a response code >= 400');

      it('makes http POST requests', () => {
        return http.request(`${baseURL}/facebook-profile`, {method: 'POST'})
          .should.eventually.equal('Created');

      });

      it('makes http GET requests', () => {
        return http.request(`${baseURL}/facebook-profile`, {method: 'GET'})
          .should.eventually.equal('Ok');
      });
    });
}

module.exports = testHTTP;
