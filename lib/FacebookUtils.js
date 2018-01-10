/** @module facebookUtils */

/**
* Generates button objects
* @param {string} type type of button according to the Send API.
* @param {array} titles array of strings from which to create text buttons
* @param {array} payloads array of objects {title, payload} to override using
 titles as payloads
* @return {array} array of messenger button objects
*/
function generateButtonObject(type, titles, payloads) {
  if (payloads) {
    return payloads.map(({title, payload}) => ({
      type,
      title,
      payload,
    }));
  } else {
    return titles.map((title) => ({
      type,
      title,
      payload: title,
    }));
  }
}

/**
 * Generate button template for quick Yes/No answers. Max 3 buttons.
 * @param {string} text the question
 * @param {array} titles array of strings that will make the button titles
 * @param {array} payloads array of objects {title, payload} to override using
 titles as payloads
 * @return {object} a messenger button template object
*/
function generateButtonTemplate(text, titles, payloads) {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text,
        buttons: generateButtonObject('postback', titles, payloads),
      },
    },
  };
}

/**
 * Generate a messenger quick reply
 * @param {string} text the question text
 * @param {array} replyArray an array of up to 11 objects that is, the answers
 * @return {object} a quick reply object
 */
function generateQuickReply(text, replyArray) {
  return {
    text,
    quick_replies: replyArray.map((e) => ({
      content_type: 'text',
      title: e,
      payload: e,
    })),
  };
}

module.exports = {
  generateButtonObject,
  generateButtonTemplate,
  generateQuickReply,
};
