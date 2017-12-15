## Logical overview
Bots are composed of 2 major components:
1. Triggers - These are network requests, words, phrases or characters that call a bot to attention
2. Responses - This is what a bot does once called to attention. It responds.

### Triggers
A bot is constantly listening for trigger events unless it's in a conversation
in which it waits for a response.

#### Web-hook/Network Request triggers
These are url endpoints that cause a Conversation function to be ran. Once this
endpoint is hit it should trigger a response.

#### Textual triggers
These are words that when typed trigger a response.

#### Verbal/voice triggers
Not yet implemented
