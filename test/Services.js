/* eslint require-jsdoc: "off" */
const services = require('../lib/Services.js');
const assert = require('assert');
const {conversation} = require('./Aggregate.js');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

const baseURL = `http://localhost:4000`;

chai.use(chaiAsPromised);
chai.should();


function testServices() {
  describe('postContactToRapidpro', () => {
    it('can create RapidPro contact');
  });

  describe('updateRapidProContact', () => {
    it('can be updated via a urn', () => {
      return services.updateRapidProContact({urn: 'facebook:1234'},
                                     {language: 'ind'},
                                            `${baseURL}/update-contact`)
        .should.eventually.equal('Updated');
    });

    it('can be updated via a uuid', () => {
      return services.updateRapidProContact({uuid: '232e4-dssdc-q3asd23e322-2323ed'},
                                     {language: 'ind'},
                                            `${baseURL}/update-contact`)
        .should.eventually.equal('Updated');
    });
  });

  describe('postSubmissiontoona', () => {
    it('can post submission to Ona', () => {
      return services.genAndPostSubmissionToOna(conversation,
                                         {name: 'Jane Doe'},
                                                `${baseURL}/ona-submission`)
      .should.eventually.equal('Created');
    });
  });
}

module.exports = testServices;
