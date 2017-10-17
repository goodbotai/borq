/* eslint require-jsdoc: "off" */
const assert = require('assert');
const utils = require('../../lib/utils/Utils.js');

function testUtils() {
  describe('test getKeybyvalue', () => {
    it('Should get the first key when a value exists', () => {
      assert.equal('b', utils.getKeyByValue({b: 4, c: 5}, 4));
    });
    it('Should return \'undefined\' when a value does nott exists', () => {
      assert.equal(undefined, utils.getKeyByValue({b: 4}, 1));
    });
  });

  describe('test mergeObjects', () => {
    it('Should combine two objects into one', () => {
      assert.deepEqual({a: 1, b: 2}, utils.mergeObjects({a: 1}, {b: 2}));
    });
    it('When two objects have the same keys return the latter', () => {
      const v = {lang: 'bt', locale: 'en_US'};
      const x = {lang: 'io', locale: 'an_NM'};
      assert.deepEqual(x, utils.mergeObjects(v, x));
      assert.deepEqual(v, utils.mergeObjects(x, v));
    });
  });

  describe('test isValueinobject', () => {
    it('should return true when the value exists in the object', () => {
      assert.equal(true, utils.isValueInObject({a: 4, b: 7}, 7));
    });
    it('should return false when the value is *not* in the object', () => {
      assert.equal(false, utils.isValueInObject({a: 4, b: 7}, 'u'));
    });
  });

  describe('test getObjectfromobjectarray', () => {
    it('returns the last object from an array of objects containing the value',
       () => {
         const obj = {lang: 'en', locale: 'en_GB'};
         const objArr = [{lang: 'en', locale: 'en_US'},
                         {lang: 'pt', locale: 'pt_BR'},
                         {lang: 'en', locale: 'en_GB'}];
         assert.deepEqual(obj, utils.getObjectFromObjectArray(objArr, 'en'));
    });
    it('returns empty object when value doesn\'t exist in any of the objects',
       () => {
         const objArr = [{lang: 'en', locale: 'en_US'},
                         {lang: 'pt', locale: 'pt_BR'}];
         assert.deepEqual({}, utils.getObjectFromObjectArray(objArr, 'in'));
    });
  });
}

module.exports = testUtils;
