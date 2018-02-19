/* eslint require-jsdoc: "off" */
const assert = require('assert');
const utils = require('../../lib/utils/Locales.js');

describe('test extractLanguageFromLocale', () => {
  test('returns a language from a given locale', () => {
    expect(utils.extractLanguageFromLocale('en_US')).toBe('en');
  });
});

describe('test extractRegionFromLocale', () => {
  test('returns a region from a given locale', () => {
    expect(utils.extractRegionFromLocale('pt_BR')).toBe('BR');
  });
});

describe('test lookupISO6391', () => {
  test('returns a language in the ISO6391 standard', () => {
    expect(utils.lookupISO6391('English')).toBe('en');
  });
});

describe('test lookupISO6392', () => {
  test('returns a language in the ISO6392 standard', () => {
    expect(utils.lookupISO6392('Indonesian')).toBe('ind');
  });
});

describe('test regionByTimeZone', () => {
  test(`returns a language in ISO6392 given a timezone`, () => {
    expect(utils.regionByTimeZone(-3)).toBe('por');
    expect(utils.regionByTimeZone(1)).toBe('default');
    expect(utils.regionByTimeZone(4)).toBe('ind');
  });
});

describe('test pickLanguage', () => {
  test(`return language in ISO6392 given locale, timezone or both`, () => {
    expect(utils.pickLanguage({locale: 'en_GB'})).toBe('eng');
    expect(utils.pickLanguage({timezone: 5})).toBe('ind');
    expect(utils.pickLanguage({timezone: -4})).toBe('por');
  });
});

describe('test lookupCountry', () => {
  test('successfully looks up by timezone', () => {
    expect(utils.lookupCountry({timezone: 8})).toBe('Indonesia');
  });
  test('successfully looks up by locale', () => {
    expect(utils.lookupCountry({locale: 'pt_BR'})).toBe('Brazil');
  });
  test('throws an exception when the country does not exist', () => {
    let badObj = {timezone: undefined, locale: undefined};
    expect(() => utils.lookupCountry(badObj)).toThrow(Error);
  });
});
