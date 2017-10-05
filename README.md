[![NPM](https://nodei.co/npm/borq.png?downloads=true&stars=true)](https://nodei.co/npm/borq/)

[![Build Status](https://travis-ci.org/goodbotai/borq.svg?branch=master)](https://travis-ci.org/goodbotai/borq)
[![npm](https://img.shields.io/npm/v/borq.svg)](https://www.npmjs.com/package/borq)
[![License](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://github.com/goodbotai/borq/blob/master/LICENSE)


# Borq
Short for Bot Orchestration, borq is a Bot orchestration framework aimed at
making it easy for people to make bots that have register users and manage them
in RapidPro and save bot and user conversations in Ona.

## Target platforms
Current:
 - Facebook messenger

Todo:
 - Telegram

## Run an example bot
```javascript
const borq = require('borq');
const facebookBot = borq.facebookBot;

/*
* Set Messenger Profile API
* https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
*/
facebookBot.setGetStarted('start');
facebookBot.setGreeting('Hello, I am a bot.');
facebookBot.setMenu([
  {
    locale: 'in_ID',
    composer_input_disabled: true,
    call_to_actions: [
      {
        type: 'web_url',
        title: 'FAQ',
        url: 'https://goodbotai.github.io/borq/',
        webview_height_ratio: 'full',
      }
    ]
  }, {
    locale: 'default',
    composer_input_disabled: true,
    call_to_actions: [
      {title: '',
       type: 'nested',
       call_to_actions: [
         {
           title: 'English',
           type: 'postback',
           payload: 'english',
         },
        {
          title: 'Bahasa',
          type: 'postback',
          payload: 'bahasa',
        },
       ],
      },
    ]
  }
]);

facebookBot.on('facebook_postback', (bot, message) => {
  if (message.payload === 'start') {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Started');
    });
  } else if (message.payload === 'english') {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Hello');
    });
  } else if (message.payload === 'bahasa') {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Halo');
    });
  }
});

facebookBot.hears(['hello'],
                  'message_received',
                  (bot, message) => {
                    bot.reply(message, 'How\'s your day going?');
});

facebookBot.hears([/([a-z])\w+/gi],
                  'message_received',
                  function(bot, message) {
                    bot.reply(message, 'I don\'t know that word yet');
});
```

## Documentation
 * [Deploying](https://github.com/goodbotai/borq/blob/master/docs/Deploying.md)
 * [Environment variables](https://github.com/goodbotai/borq/blob/master/docs/Environment%20Variables.md)
 * [Persistence](https://github.com/goodbotai/borq/blob/master/docs/Persistence.md)
 * [Testing](https://github.com/goodbotai/borq/blob/master/docs/Testing.md)
 * [API Docs](https://goodbotai.github.io/borq)

# License
[BSD-2-Clause](LICENSE)
