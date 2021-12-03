# Getting started

This section will guide you into deploying Freeday.

It is intended to work on a classic production environment.

Deploying Freeday in a local environment needs additional steps so the Slack bot can work properly. More details the [Local deployment](/docs/doc/local-deployment) section.

## Slack app

You have to create a Slack app to use the Slack bot in Freeday.

* Go to the [Slack apps page](https://api.slack.com/apps) and hit *Create New App*.
* Select *From App Manifest*
* Select your Workspace
* Edit the app manifest so it looks like the one below

```yaml
_metadata:
  major_version: 1
  minor_version: 1
display_information:
  name: Freeday
  description: 'Dayoff management with chat bots'
  background_color: '#30404d'
features:
  app_home:
    home_tab_enabled: false
    messages_tab_enabled: true
    messages_tab_read_only_enabled: false
  bot_user:
    display_name: Freeday
    always_online: true
oauth_config:
  redirect_urls:
    # change the URL here
    - https://public.freeday.url/
  scopes:
    bot:
      - chat:write
      - im:history
      - im:read
      - im:write
      - team:read
      - users:read
      - channels:read
      - groups:read
settings:
  event_subscriptions:
    # change the URL here
    request_url: https://public.freeday.url/api/slack/events
    bot_events:
      - message.im
  interactivity:
    is_enabled: true
    # change the URL here
    request_url: https://public.freeday.url/api/slack/events
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

Finally, install the app to your Workspace in the *Install App* section.

> Note: The `event_subscriptions` URL must be validated in Slack app configuration.
> To activate the URL, Freeday must be running and listening to Slack API calls.
> No worries, you can do the activation after deploying and running Freeday.

## Deployment

Freeday can be easily deployed using Docker images.

You can find below an example of `docker-compose.yaml` file and its `.env` companion.

Edit configuration as you wish then run the whole thing using `docker-compose up -d`.

### docker-compose.yml

```yaml
version: '3'

services:
  freeday-api:
    image: freedayapp/freeday-api
    container_name: freeday-api
    restart: always
    env_file:
      - .env
    networks:
      - freeday-network
    ports:
      - 8787:8787
  freeday-web:
    image: freedayapp/freeday-web
    container_name: freeday-web
    restart: always
    env_file:
      - .env
    networks:
      - freeday-network
    ports:
      - 8788:8788
  freeday-mongo:
    image: mongo
    container_name: freeday-mongo
    restart: always
    command: mongod --quiet --logpath /dev/null
    networks:
      - freeday-network

networks:
  freeday-network:
    name: freeday
```

### .env

```shell
##
## General
##

# Freeday web front URL
# E.g. https://freeday.domain.com/ or http://localhost:8788/
FRONT_PUBLIC_URL=http://localhost:8788/

# Freeday API URL
# E.g. https://api.freeday.domain.com/ or http://localhost:8787/
API_PUBLIC_URL=http://localhost:8787/

# Port on which Freeday API will run
API_PORT=8787

# Path to logs directory
API_LOG_DIR=/var/log/freeday

##
## Database
##

# Mongo database URL
MONGO_URL=mongodb://freeday-mongo:27017/freeday

# Mongo test database URL
# This database is used when running tests
# Not needed in production
#MONGO_TEST_URL=mongodb://freeday-mongo:27017/freeday-test

##
## Slack bot
##

# If Slack bot should be enabled
SLACK_ENABLED=true

# Slack configuration
SLACK_CLIENT_ID=1234567891234.1234567891234
SLACK_CLIENT_SECRET=12345678912341234567891234
SLACK_SIGNING_SECRET=abc123abc123abc123abc123abc123
SLACK_ACCESS_TOKEN=xoxb-12345678-12345678-abc123abc123abc123abc123

##
## Dialogflow
##

# If Dialogflow NLU should be enabled
DIALOGFLOW_ENABLED=false

# Dialogflow configuration
DIALOGFLOW_KEYFILE=/path/to/keyfile.json
DIALOGFLOW_ENDPOINT=europe-west1-dialogflow.googleapis.com
DIALOGFLOW_PROJECT=my-project
DIALOGFLOW_LOCATION=europe-west1
DIALOGFLOW_ENVIRONMENT=production
DIALOGFLOW_USER=my-user
DIALOGFLOW_SESSION=1234
DIALOGFLOW_LANGUAGE=en
```

## First usage

### Web client

When running Freeday for the first time, you need to go on the Welcome page so you can create the first administrator account.

Run `docker logs freeday-api` to display Freeday API logs and get the Welcome URL from there.

> Note: The Welcome URL will appear in the API logs only if there is no user in database

### Slack bot

Go into your Slack workspace and reach the *Applications* section at the bottom of the sidebar and hit *Add applications*.

Your Freeday app should appear in the app list. Click it and start chatting with the Freeday Slack bot.
