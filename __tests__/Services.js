/* eslint require-jsdoc: "off" */
const nock = require('nock');

const services = require('../lib/Services.js');
const utils = require('../lib/utils/Utils.js');
const {conversation} = require('./Aggregate.js');

const userProfile = {
  first_name: 'John',
  last_name: 'Doe',
  profile_pic: '',
  locale: 'en_US',
  timezone: 3,
  gender: 'Male',
  is_payment_enabled: true,
};

const onaBaseURL = 'https://api.ona.io';
const rapidProBaseURL = 'https://rapidpro.ona.io/api/v2/';
const groupUUID = 'y34w-3er4-ew23-2323';

nock(onaBaseURL)
  .persist()
  .post('/orgname/ona-submission')
  .reply(201, {text: 'Created'});

const rapidPro = nock(rapidProBaseURL).persist();

rapidPro
  .get('/groups.json')
  .query({uuid: groupUUID})
  .reply(200, {text: 'Got'});

rapidPro
  .post('/contacts.json', {language: 'ind'})
  .query((urn, uuid) => {
    if (urn || uuid) {
      return true;
    } else {
      return false;
    }
  })
  .reply(201, {text: 'Updated'});


describe('RapidPro', () => {
  describe('Groups', () => {
    test('Can get a group', () => {
      return services
        .getGroup(groupUUID)
        .then((data) => expect(data).toEqual({text: 'Got'}));
    });
  });

  describe('Contacts', () => {
    describe('updateRapidProContact', () => {
      test('can be updated via a urn', () => {
        return services
          .updateUser({urn: 'facebook:1234'}, {language: 'ind'})
          .then((data) => expect(data).toEqual({text: 'Updated'}));
      });

      test('can be updated via a uuid', () => {
        return services
          .updateUser({uuid: '232e4-dssdc-q32322-2323ed'}, {language: 'ind'})
          .then((data) => expect(data).toEqual({text: 'Updated'}));
      });
    });
  });
});


describe('Ona', () => {
  test('can post submission to Ona', () => {
    return services
      .genAndPostSubmissionToOna(
        conversation,
        {
          name: 'Jane Doe',
          idString: '23f23wre-ewe',
        },
        `${onaBaseURL}/orgname/ona-submission`
      )
      .then((data) => expect(data).toEqual({text: 'Created'}));
  });
});
