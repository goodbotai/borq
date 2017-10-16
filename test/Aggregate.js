const assert = require('assert');

const aggregate = require('../lib/Aggregate.js');
const utils = require('../lib/utils/Utils.js');

function testAggregate() {
  const conversation = {
    responses: {
      playWithHomemadeToys: {
        text: 'no',
        user: '',
        channel: '',
        page: '',
        timestamp: 1507807489797,
        type: 'facebook_postback',
        referral: undefined,
        question: '',
      },
      playWithShopToys: {
        text: 'yes',
        user: '',
        channel: '',
        page: '',
        timestamp: 1507807496394,
        type: 'facebook_postback',
        referral: undefined,
        question: '',
      },
      playHouseholdObjects: {
        text: 'idk',
        user: '',
        channel: '',
        page: '',
        timestamp: 1507807502260,
        type: 'facebook_postback',
        referral: undefined,
        question: '',
      },
    }
  };

  describe('aggregate', () => {
    it('returns an object containing a user ID under userId');
    it('returns an object containing a submission under submission_metadata');
    it('the submission object has timestamps alongside it');
  });

  describe('extractTimestamps', () => {
    const responses = conversation.responses;
    it('converts unix timestamps to ISO 8601 timestamps', () => {
      const unixTimestamp = 1507807496394;
      const responses = {aQuestion: {timestamp: unixTimestamp}};
      const date = new Date(unixTimestamp);
      assert.deepEqual(date, aggregate.extractTimeStamps(responses).aQuestionTimeStamp.text);
    });
    it('creates a question<timeStamp> reponse for each response with a timestamp in the response object', () => {
      const responsesWithTimeStamps = aggregate.extractTimeStamps(responses);
      const expectedArray = utils.mergeObjects(Object.keys(responses),
                                               Object.keys(responses).map((e) => e+'TimeStamp'));
      assert.deepEqual(expectedArray, Object.keys(responsesWithTimeStamps));
    });
  });
}

module.exports = testAggregate;
