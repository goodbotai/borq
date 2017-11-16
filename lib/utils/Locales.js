/** @module localeUtils */
const utils = require('./Utils.js');

/**
* Lookup table of often used languages
* @constant
* @type {array}
*/
const languages = [
  {
    locale: 'en_US',
    name: 'English',
    iso6391: 'en',
    iso6392: 'eng',
  },
  {
    locale: 'pt_BR',
    name: 'Portuguese',
    iso6391: 'pt',
    iso6392: 'por',

  },
  {
    locale: 'in_ID',
    name: 'Indonesian',
    iso6391: 'in',
    iso6392: 'ind',
  },
];

/**
* Splits a locale into language and region but only returns language
* @param {string} locale a string of language_region for example: "en_GB"
* @return {string} the language part of a locale
*/
function extractLanguageFromLocale(locale) {
  return locale.split('_')[0];
}

/**
* Splits a locale into language and region but only returns language
* @param {string} locale a string of language_region for example: "en_GB"
* @return {string} the language part of a locale
*/
function extractRegionFromLocale(locale) {
  return locale.split('_')[1];
}
/**
* @param {string} language the language you want to look up
* @return {string} an ISO6392 language code string
*/
function lookupISO6392(language) {
  return utils.getObjectFromObjectArray(languages, language).iso6392;
}

/**
* @param {string} language the language you want to look up
* @return {string} an ISO6391 language code string
*/
function lookupISO6391(language) {
  return utils.getObjectFromObjectArray(languages, language).iso6391;
}

/**
* Get the region for a specific timezone
* @param {Integer} timezone The timezone of the user runs from 0 to 12
* @return {String} the region that the user is in
*/
function regionByTimeZone(timezone) {
  if (timezone < 0) {
    return 'por';
  } else if (timezone > 3) {
    return 'ind';
  } else {
    return 'default';
  }
}

/**
* First try locale, if it fails try timezone, if that fails use default
* @param {String} locale of the user from FB
* @param {String} timezone of the user from FB
* @return {String} language as a ISO6392 string
*/
function pickLanguage({locale, timezone}) {
  if (locale) {
    const lang = localeUtils.extractLanguageFromLocale(locale) ||
          config.defaultLanguage;
    return localeUtils.lookupISO6392(lang);
  } else {
    const region = regionByTimeZone(timezone);
    const lang = 'default' ? config.defaultLanguage : region;
    return localeUtils.lookupISO6392(lang);
  }
}


module.exports = {
  extractLanguageFromLocale,
  extractRegionFromLocale,
  lookupISO6391,
  lookupISO6392,
  languages,
  regionByTimeZone,
  pickLanguage,
};
