/* eslint require-jsdoc: "off" */
const nock = require('nock');

const services = require('../lib/Services.js');
const {conversation} = require('./Aggregate.js');

const onaBaseURL = 'https://api.ona.io';
const rapidProBaseURL = 'https://rapidpro.ona.io/api/v2/';
const groupUUID = 'y34w-3er4-ew23-2323';

const ona = nock(onaBaseURL).persist();
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

ona
  .post('/orgname/ona-submission', (body) => {
    if (body.submission.meta.instanceID) {
      return true;
    } else {
      return false;
    }
  })
  .reply(201, {submission: {meta: {instanceID: 'uuid:some-uuid-57uff'}}});

describe('RapidPro', () => {
  describe('Groups', () => {
    test('Can get a group', () => {
      return services
        .getGroup(groupUUID)
        .then(({body}) => expect(body).toEqual({text: 'Got'}));
    });
  });

  describe('Contacts', () => {
    describe('updateRapidProContact', () => {
      test('can be updated via a urn', () => {
        return services
          .updateUser({urn: 'facebook:1234'}, {language: 'ind'})
          .then(({body}) => expect(body).toEqual({text: 'Updated'}));
      });

      test('can be updated via a uuid', () => {
        return services
          .updateUser({uuid: '232e4-dssdc-q32322-2323ed'}, {language: 'ind'})
          .then(({body}) => expect(body).toEqual({text: 'Updated'}));
      });
    });
  });
});

describe('Ona', () => {
  describe('Can handle UUID as an extra field', () => {
    test('Can take a submission UUID as an extra field', () => {
      return services
        .genAndPostSubmissionToOna(
          conversation,
          {
            name: 'Jane Doe',
            idString: '23f23wre-ewe',
            uuid: 'uuid:630045b2-0c10-4a8f-a879-1f6509b829e5',
          },
          `${onaBaseURL}/orgname/ona-submission`
        )
        .then((data) =>
          expect(data).toHaveProperty('submission.meta.instanceID')
        );
    });
  });

  describe('Ona submission generates a UUID if not passed', () => {
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
        .then((data) =>
          expect(data).toHaveProperty('submission.meta.instanceID')
        );
    });
  });
});
