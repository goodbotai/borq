/** @module services.facebook */
const http = require('../../lib/HTTP.js');
const {
  facebookApiVersion,
  facebookPageAccessToken,
} = require('../../config/Config.js');

const facebookURL = 'https://graph.facebook.com/';

/**
 * Get the facebook profile from facebook
 * @param {string} fbMessengerId facebook messenger ID
 * @param {string} baseURL - change the base URL for testing
 * @return {promise} facebook profile consisting:
 * first_name, last_name, profile_pic, locale, timezone, gender
 * is_payment_enabled, last_ad_referral
 */
function getFacebookProfile(fbMessengerId, baseURL = facebookURL) {
  const url = `${baseURL}${facebookApiVersion}/${fbMessengerId}?fields=first_name,last_name,profile_pic,locale,timezone,gender,is_payment_enabled,last_ad_referral&access_token=${facebookPageAccessToken}`;
  return http.request(url, {}, 'GET Facebook profile: ');
}

module.exports = {
  getFacebookProfile,
};
