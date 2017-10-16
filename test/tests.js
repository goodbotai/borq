const testUtils = require('./utils/Utils.js');
const testHTTP = require('./HTTP.js');
const testAggregate = require('./Aggregate.js');

process.env['NODE_ENV'] = 'test';

testAggregate();
testHTTP();
testUtils();
