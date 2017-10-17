/* eslint require-jsdoc: "off" */
const assert = require('assert');

const config = require('../config/Config.js');
const aggregate = require('../lib/Aggregate.js');
const utils = require('../lib/utils/Utils.js');

function testAggregate() {
  const user = 1234567;
  const unixTimestamp = 1507807496394;
  const conversation = {
    context: {
      user,
    },
    responses: {
      playWithShopToys: {
        text: 'yes',
        user: '',
        channel: '',
        page: '',
        timestamp: unixTimestamp,
        type: 'facebook_postback',
        referral: undefined,
        question: '',
      },
    },
  };
  const date = new Date(unixTimestamp);
  const aggregated = aggregate.aggregate(conversation);
  const onaSubmission = aggregate.genOnaSubmission(aggregated);
  const instanceID = onaSubmission.submission.meta.instanceID;

  describe('aggregate', () => {
    it('returns an object containing a user ID under psid', () => {
      assert.equal(user, aggregate.aggregate(conversation).psid);
    });

    it('returns an object containing responses under responses',
       () => {
         assert.ok(aggregate.aggregate(conversation).responses);
       });

    it('the aggregated conversation has ISO 8601 timestamps in it',
       () => {
         const res = aggregate.aggregate(conversation).responses;
         assert.deepEqual(date, res.playWithShopToysTimeStamp.text);
       });
  });

  describe('extractTimestamps', () => {
    const responses = conversation.responses;

    it('converts unix timestamps to ISO 8601 timestamps', () => {
      const responses = conversation.responses;
      const timestamps = aggregate.extractTimeStamps(responses);
      assert.deepEqual(date, timestamps.playWithShopToysTimeStamp.text);
    });

    it('creates a question<TimeStamp> reponse for responses with a timestamp',
       () => {
         const responsesWithTimeStamps = aggregate.extractTimeStamps(responses);
         const expectedArray = utils.mergeObjects(
           Object.keys(responses),
           Object.keys(responses).map((e) => e+'TimeStamp')
         );
         assert.deepEqual(expectedArray, Object.keys(responsesWithTimeStamps));
    });
  });

  describe('genOnaSubmission', () => {
    it('generates a valid submission', () => {
      const expected = {id: config.onaFormIdString,
                        submission: {
                          playWithShopToys: 'yes',
                          playWithShopToysTimeStamp: date,
                          meta: {instanceID},
                        },
                       };
      assert.deepEqual(expected, onaSubmission);
    });

    it('has an instance id for each submission', () => {
      assert.ok(instanceID);
    });

    it('generates repeat groups in general');
    it('is not a convoluted mess');
  });
}

module.exports = testAggregate;
