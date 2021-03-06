/** @module localeUtils */
const utils = require('./Utils.js');
const config = require('../../config/Config.js');

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
    country: 'English Speaking',
  },
  {
    locale: 'pt_BR',
    name: 'Portuguese',
    iso6391: 'pt',
    iso6392: 'por',
    country: 'Brazil',
  },
  {
    locale: 'id_ID',
    name: 'Indonesian',
    iso6391: 'id',
    iso6392: 'ind',
    country: 'Indonesia',
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
 * First try timezone, if it fails try locale, if that fails use default
 * @param {String} timezone of the user from FB
 * @param {string} locale a language_region string for example: "en_GB"
 * @return {string} name of a country
 */
function lookupCountry({timezone, locale}) {
  if (timezone || locale) {
    let value;
    if (regionByTimeZone(timezone) !== 'default') {
      value = regionByTimeZone(timezone);
    } else if (locale) {
      value = extractLanguageFromLocale(locale);
    } else {
      value = 'eng';
    }
    return utils.getObjectFromObjectArray(languages, value).country;
  } else {
    throw new Error('Provide a locale or timezone');
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
    const lang = extractLanguageFromLocale(locale) || config.defaultLanguage;
    return lookupISO6392(lang);
  } else {
    const region = regionByTimeZone(timezone);
    const lang = region == 'default' ? config.defaultLanguage : region;
    return lookupISO6392(lang);
  }
}

module.exports = {
  languages,
  pickLanguage,
  lookupISO6391,
  lookupISO6392,
  lookupCountry,
  regionByTimeZone,
  extractLanguageFromLocale,
  extractRegionFromLocale,
};
