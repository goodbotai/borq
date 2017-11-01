/* eslint require-jsdoc: "off" */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const services = require('../lib/Services.js');
const {conversation} = require('./Aggregate.js');

const baseURL = `http://localhost:4000`;
chai.use(chaiAsPromised);
chai.should();

const userProfile = {
  first_name: 'John',
  last_name: 'Doe',
  profile_pic: '',
  locale: 'en_US',
  timezone: 3,
  gender: 'Male',
  is_payment_enabled: true,
};


function testServices() {
  describe('Can create a user', () => {
    specify('With only facebook urn', () => {
      const facebookProfile = userProfile;
      return services.createUser(['facebook:123455233343123'],
                                 ['23433-2343-2343-1234'],
                                 'eng',
                                 facebookProfile,
                                 {referrer: 'sd32-s1da-0812-po92'},
                                 `${baseURL}/create-contact`)
        .should.eventually.equal('Created');
    });
    specify('With only phone number as the urn', () => {
      return services.createUser(['tel:+254723432334'],
                                 ['23433-2343-2343-1234'],
                                 'eng',
                                 userProfile,
                                 {},
                                 `${baseURL}/create-contact`)
        .should.eventually.equal('Created');
    });
    specify('With multiple urns', () => {
      return services.createUser(['facebook: 2343123434', 'tel:+254723432334'],
                                 ['23433-2343-2343-1234'],
                                 'eng',
                                 userProfile,
                                 {},
                                 `${baseURL}/create-contact`)
        .should.eventually.equal('Created');
    });
  });

  describe('updateRapidProContact', () => {
    it('can be updated via a urn', () => {
      return services.updateUser({urn: 'facebook:1234'},
                                 {language: 'ind'},
                                 `${baseURL}/update-contact`)
        .should.eventually.equal('Updated');
    });

    it('can be updated via a uuid', () => {
      return services.updateUser({uuid: '232e4-dssdc-q32322-2323ed'},
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
