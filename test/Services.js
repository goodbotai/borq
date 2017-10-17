/* eslint require-jsdoc: "off" */
const services = require('../lib/Services.js');
const assert = require('assert');
const {conversation} = require('./Aggregate.js');

const baseURL = `http://localhost:4000`;

function testServices() {
  describe('postContactToRapidpro', () => {
    it('can create RapidPro contact');
  });

  describe('updateRapidProContact', () => {
    it('can be updated via a urn', () => {
      services.updateRapidProContact({urn: 'facebook:1234'},
                                     {language: 'ind'},
                                     `${baseURL}/update-contact`)
        .then((res) => assert.equal('updated', res));
    });

    it('can be updated via a uuid', () => {
      services.updateRapidProContact({uuid: '232e4-dssdc-q3asd23e322-2323ed'},
                                     {language: 'ind'},
                                     `${baseURL}/update-contact`)
        .then((res) => assert.equal('updated', res));
    });
  });

  describe('postSubmissiontoona', () => {
    it('can post submission to Ona', () => {
      services.genAndPostSubmissionToOna(conversation,
                                         {name: 'Jane Doe'},
                                         `${baseURL}/ona-submission`)
        .then((res) => assert.equal('Created', res));
    });
  });
}

module.exports = testServices;
