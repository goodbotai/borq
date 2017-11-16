/* eslint require-jsdoc: "off" */
const assert = require('assert');
const utils = require('../../lib/utils/Locales.js');

function testLocales() {
  describe('test extractLanguageFromLocale', () => {
    it('returns a language from a given locale', () => {
      assert.equal('en',utils.extractLanguageFromLocale('en_US'));
    });
  });
  describe('test extractRegionFromLocale', () => {
    it('returns a region from a given locale', () => {
      assert.equal('BR',utils.extractRegionFromLocale('pt_BR'));
    });
  });
  describe('test lookupISO6391', () => {
    it('returns a language in the ISO6391 standard', () => {
      assert.equal('en',utils.lookupISO6391('English'));
    });
  });
  describe('test lookupISO6392', () => {
    it('returns a language in the ISO6392 standard', () => {
      assert.equal('ind',utils.lookupISO6392('Indonesian'));
    });
  });
  describe('test regionByTimeZone', () => {
    it('returns a language in the ISO6392 standard from a given timezone', () => {
      assert.equal('por',utils.regionByTimeZone(-3));
      assert.equal('default',utils.regionByTimeZone(1));
      assert.equal('ind',utils.regionByTimeZone(4));
    });
  });
  describe('test pickLanguage', () => {
    it('returns a language in the ISO6392 standard given either a locale or timezone or both', () => {
      assert.equal('eng',utils.pickLanguage({locale:'en_GB'}));
      assert.equal('ind',utils.pickLanguage({timezone:5}));
      assert.equal('por',utils.pickLanguage({timezone:-4}));
    });
  });
}

module.exports = testLocales;
