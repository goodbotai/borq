const utils = require('./Utils.js');

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

module.exports = {
  extractLanguageFromLocale,
  extractRegionFromLocale,
  lookupISO6391,
  lookupISO6392,
  languages,
};
