/* eslint require-jsdoc: "off" */
const nock = require('nock');
const request = require('../lib/HTTP.js');

const url = 'https://exampe-url.com';
const user = {name: 'John Doe', fields: {age: 23}};
const obj = {f: {g: 'a'}};
const jsonObj = JSON.stringify(obj);

nock(url)
  .get('/')
  .reply(200, {text: 'Hello'})
  .post('/', obj)
  .reply(201, user)
  .persist();

describe('test request', () => {
  it('retry HTTP requests with a response code >= 400');

  it('makes GET requests', () => {
    return request(url, {method: 'GET'}).then((data) =>
      expect(data.text).toBe('Hello')
    );
  });

  it('makes POST requests', () => {
    return request(url, {method: 'POST', body: jsonObj}).then((data) =>
      expect(data).toEqual(user)
    );
  });
});
