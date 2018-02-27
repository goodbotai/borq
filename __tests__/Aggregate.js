/* eslint require-jsdoc: "off" */
/* eslint max-len: ["error", { "code": 100 }]*/
const assert = require('assert');

const aggregate = require('../lib/Aggregate.js');
const utils = require('../lib/utils/Utils.js');

const time = new Date();
const user = 1234567;
const unixTimestamp = 1507807496394;
const conversation = {
  context: {
    user,
  },
  startTime: time,
  lastActive: time,
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

describe('aggregate', () => {
  it('returns an object containing a user ID under psid', () => {
    expect(aggregate.aggregate(conversation).psid).toBe(user);
  });

  it('returns an object containing responses under responses', () => {
    expect(aggregate.aggregate(conversation).responses);
  });

  it('the aggregated conversation has ISO 8601 timestamps in it', () => {
    const res = aggregate.aggregate(conversation).responses;
    expect(res.playWithShopToysTimeStamp.text).toEqual(date);
  });
});

describe('extractTimestamps', () => {
  const responses = conversation.responses;

  it('converts unix timestamps to ISO 8601 timestamps', () => {
    const responses = conversation.responses;
    const timestamps = aggregate.extractTimeStamps(responses);
    expect(timestamps.playWithShopToysTimeStamp.text).toEqual(date);
  });

  it('creates a question<TimeStamp> reponse for responses with a timestamp', () => {
    const responsesWithTimeStamps = aggregate.extractTimeStamps(responses);
    const expectedArray = Object.values(
      utils.mergeObjects(
        Object.keys(responses),
        Object.keys(responses).map((e) => e + 'TimeStamp')
      )
    );
    expect(Object.keys(responsesWithTimeStamps)).toEqual(expectedArray);
  });
});

describe('genOnaSubmission', () => {
  it('generates a valid submission', () => {
    const expected = {
      submission: {
        playWithShopToys: 'yes',
        playWithShopToysTimeStamp: date,
      },
    };
    expect(onaSubmission).toEqual(expected);
  });

  it('generates repeat groups in general');
  it('is not a convoluted mess');
});

module.exports = {
  conversation
};
