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
const {
  facebookBot,
  config
} = borq;

/*
* Set Messenger Profile API
* https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
*/
facebookBot.setGetStarted('start');
facebookBot.setGreeting('Hello, I am a bot.');
facebookBot.setMenu([
  {
    locale: 'default',
    composer_input_disabled: true,
    call_to_actions: [
      {
        type: 'web_url',
        title: 'FAQ',
        url: 'https://goodbotai.github.io/borq/',
        webview_height_ratio: 'full',
      }
    ]
  }
]);

facebookBot.borqBot.on('facebook_postback', (bot, message) => {
  if (message.payload === 'start') {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Started');
    });
  } else {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage(t('hello'));
    });
  }});

facebookBot.borqBot.hears(['hello'],
                          'message_received',
                          (bot, message) => bot.reply(message, t('key')));

const botty = facebookBot.borqBot.spawn({});

facebookBot.start(botty, (err, webserver) => {
  // Add routes for your bot to listen on
  webserver.get('/', (req, res) => {
    res.send('<h3>This is a bot</h3>');
  });
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
