/* eslint require-jsdoc: "off" */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const services = require('../lib/Services.js');
const {conversation} = require('./Aggregate.js');

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
      return services.updateRapidProContact({uuid: '232e4-dssdc-q32322-2323ed'},
                                     {language: 'ind'},
                                            `${baseURL}/update-contact`)
        .should.eventually.equal('Updated');
    });
  });

  describe('postSubmissiontoona', () => {
    it('can post submission to Ona', () => {
      return services.genAndPostSubmissionToOna(conversation,
                                                {
                                                  name: 'Jane Doe',
                                                  idString: '23f23wre-ewe',
                                                },
                                                `${baseURL}/ona-submission`)
      .should.eventually.equal('Created');
    });
  });
}

module.exports = testServices;
