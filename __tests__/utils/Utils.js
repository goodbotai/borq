/* eslint require-jsdoc: "off" */
/* eslint max-len: ["error", { "code": 100 }]*/

const utils = require('../../lib/utils/Utils.js');

describe('test getKeybyvalue', () => {
  it('Should get the first key when a value exists', () => {
    expect(utils.getKeyByValue({b: 4, c: 5}, 4)).toBe('b');
  });
  it("Should return 'undefined' when a value does nott exists", () => {
    expect(utils.getKeyByValue({b: 4}, 1)).toBe(undefined);
  });
});

describe('test mergeObjects', () => {
  it('Should combine two objects into one', () => {
    expect(utils.mergeObjects({a: 1}, {b: 2})).toEqual({a: 1, b: 2});
  });
  it('When two objects have the same keys return the latter', () => {
    const v = {lang: 'bt', locale: 'en_US'};
    const x = {lang: 'io', locale: 'an_NM'};
    expect(utils.mergeObjects(v, x)).toEqual(x);
    expect(utils.mergeObjects(x, v)).toEqual(v);
  });
});

describe('test isValueinobject', () => {
  it('should return true when the value exists in the object', () => {
    expect(utils.isValueInObject({a: 4, b: 7}, 7)).toBe(true);
  });
  it('should return false when the value is *not* in the object', () => {
    expect(utils.isValueInObject({a: 4, b: 7}, 'u')).toBe(false);
  });
});

describe('test getObjectfromobjectarray', () => {
  it('returns the last object from an array of objects containing the value', () => {
    const obj = {lang: 'en', locale: 'en_GB'};
    const objArr = [
      {lang: 'en', locale: 'en_US'},
      {lang: 'pt', locale: 'pt_BR'},
      {lang: 'en', locale: 'en_GB'},
    ];
    expect(utils.getObjectFromObjectArray(objArr, 'en')).toEqual(obj);
  });
  it("returns empty object when value doesn't exist in any of the objects", () => {
    const objArr = [
      {lang: 'en', locale: 'en_US'},
      {lang: 'pt', locale: 'pt_BR'},
    ];
    expect(utils.getObjectFromObjectArray(objArr, 'in')).toEqual({});
  });
});
