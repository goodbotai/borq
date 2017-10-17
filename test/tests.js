const testUtils = require('./utils/Utils.js');
const testHTTP = require('./HTTP.js');
const {testAggregate} = require('./Aggregate.js');
const testServices = require('./Services.js');

process.env['NODE_ENV'] = 'test';

testServices();
testAggregate();
testHTTP();
testUtils();
