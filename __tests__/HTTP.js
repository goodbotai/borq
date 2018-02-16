/* eslint require-jsdoc: "off" */
const HTTP = require('../lib/HTTP.js');

function testHTTP() {
  describe('test request', () => {
    it('retry HTTP requests with a response code >= 400');

    it('makes http POST requests', () => {
      return HTTP.request(`${baseURL}/facebook-profile`, {
        method: 'POST',
      }).should.eventually.equal('Created');
    });

    it('makes http GET requests', () => {
      return HTTP.request(`${baseURL}/facebook-profile`, {
        method: 'GET',
      }).should.eventually.equal('Ok');
    });
  });
}

module.exports = testHTTP;
