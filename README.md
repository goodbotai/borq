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

`$ FACEBOOK_PAGE_ACCESS_TOKEN= FACEBOOK_APP_SECRET= FACEBOOK_VERIFY_TOKEN= yarn dev`

```javascript
const borq = require('borq');
const {
  facebook,
  config
} = borq;

const {controller} = facebook;
const botty = controller.spawn({});

/*
* Set Messenger Profile API
* https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
*/
facebook.setMenu([
  {
    locale: 'default',
    composer_input_disabled: true,
    call_to_actions: [
         {
           title: 'Restart',
           type: 'postback',
           payload: 'restart',
         }, {
           title: 'Other',
           type: 'postback',
           payload: 'other',
         }, {
           type: 'web_url',
           title: 'FAQ',
           url: 'https://goodbotai.github.io/borq/',
           webview_height_ratio: 'full',
         }
       ],
  },
]);
facebook.setGetStarted('start');
facebook.setGreeting('Hello, I am a bot.');

controller.on('facebook_postback', (bot, message) => {
  if (message.payload === 'start') {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Welcome to my lair!');
    });
  } else {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Hello, you added a postback?');
    });
  }});

controller.hears(['talk'],
                 'message_received',
                 (bot, message) => {
                   bot.startConversation(message, (err, convo) => {
                     convo.addQuestion('Say something',
                                       (res, con) => con.next());
                     convo.addQuestion('Ok bye', (res, con) => con.next());
                   });
                 });

facebook.start(botty, (err, webserver) => {
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
