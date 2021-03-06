None of these vars is required by themselves but you need to set a few of
them to create a functioning bot.

| Environment variable               | Descpription                                                                                 | Default                              |
| :--------------------------------: | :------------------------------------------------------------------------------------------: | :----------------------------------: |
| NODE_ENV                           | test, dev and production                                                                     | 'dev'                                |
| DEBUG                              | To run in debug mode or not                                                                  | false                                |
| DEAFULT_LANGUAGE (ISO 639-1 Code)  | The language you want the bot to communicate in.                                             | 'en'                                 |
| HOST_PORT (docker)                 | Container port in the host                                                                   | undefined                            |
| APP_PORT (docker)                  | App port in the container                                                                    | 3000                                 |
| PORT                               | Port that your bot is listening on. If in docker APP_PORT = PORT                             | 3000                                 |
| ONA_USERNAME                       | Ona user or organization username                                                            | undefined                            |
| ONA_FORM_IDS                       | JSON Object of Ona form ID strings. We use it to identify the form to make submissins to.    | {}                                   |
| ONA_API_TOKEN                      | API token provided by Ona. Required if sending data to Ona.                                  | undefined                            |
| RAPIDPRO_API_TOKEN                 | API token provided by Rapidpro. Required if creating or updating RapidPro contacts.          | undefined                            |
| RAPIDPRO_GROUPS                    | JSON Object of keys to Rapidpro group UUIDs that your users should be added to               | {}                                   |
| DELETED_USER_RAPIDPRO_GROUPS       | JSON Object of keys to Rapidpro group UUIDs that your users should be moved to               | {}                                   |
| SENTRY_DSN                         | DSN provided by Sentry                                                                       | undefined                            |
| ACCESS_LOG_FILE                    | File to store access logs                                                                    | bot.access.log                       |
| DEBUG_TRANSLATIONS                 | Whether to turn off or on translations debugging                                             | false                                |
| TRANSLATIONS_DIR                   | Path to the dir holding the translations files.                                              | './translations'                     |
| FACEBOOK_VERIFY_TOKEN              | Token used to verify your app to the webhooks endpoint listens on /facebook/recieve          | 'borq'                               |
| FACEBOOK_APP_SECRET                | Facebook provided app secret. Required for Messenger.                                        | undefined                            |
| FACEBOOK_API_HOST                  | Set the api_host. In testing `http://256.256.256.256` in any other env `undefined`           | undefined or http://256.256.256.256  |
| CONVERSATION_TIMEOUT               | Time to wait for a user to respond (in milliseconds).                                        | 60000 * 20 (20 mins)                 |
| FACEBOOK_PAGE_ACCESS_TOKEN         | Facebook provided token needed to post as a page. Required for Messenger.                    | undefined                            |
| FACEBOOK_API_VERSION               | The version of the facebook API to use when making Facebook API calls.                       | 'v2.10'                              |
| GRAYLOG_HOST                       | Graylog server address                                                                       | 'localhost'                          |
| GRAYLOG_PORT                       | Graylog server port                                                                          | 12201                                |
| FACILITY                           | Application or container specific identifying string                                         | 'localhost'                          |
| HOSTNAME                           | The name of the host                                                                         | 'borq'                               |




examples:
```bash
$ export DELETED_USER_RAPIDPRO_GROUPS="{\"del\": \"l0ng-gr0up-n4m3-uu1d\"}"
$ export RAPIDPRO_GROUPS="{\"ind\": \"l0ng-gr0up-n4m3-uu1d\", \"por\": \"l0ng-gr0up-n4m3-uu1d\", \"default\": \"l0ng-gr0up-n4m3-uu1d\"}"
$ export ONA_FORM_IDS="{\"caregiverKnowledge\": \"aKRKGasdcr343434vPN\", \"FCI\": \"FCI\", \"srq20 \": \"arfwer333423we\"}"
```
