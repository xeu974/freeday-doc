# Deployment

## Docker

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
# E.g. https://web.domain.com/ or http://localhost:8788/
FRONT_PUBLIC_URL=http://localhost:8788/

# Freeday API URL
# E.g. https://api.domain.com/ or http://localhost:8787/
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

## Local deployment

When deploying Freeday on a local environment, some additional steps are require so everything works properly.

In a local environment, the Freeday URL will be something like `http://localhost:8788/`.
The problem is that Slack API can't reach your Freeday instance through this URL.
Therefore you need to setup some kind of proxy / tunnel and set the correct URL in the Slack app manifest so it ca communicates with your Freeday instance.

Here we're gonna use [Ngrok](https://ngrok.com/).

### Running Ngrok

Start a Ngrok tunnel targetting the API port (default is `8787`).

```shell
ngrok http 8787
```

Then get the tunnel `https` URL in the Ngrok console. It should look like this: `https://1234-12-34-123-12.ngrok.io`.

### Configuring Slack app

Go in to the [Slack apps page](https://api.slack.com/apps) and edit your Freeday app.

Put the Ngrok `https` link in the `oauth_config`, `event_subscriptions` and `interactivity` sections. In the `event_subscriptions` and `interactivity` sections, be sure to keep the `/api/slack/events` path. Values should look like the example below.

```yaml
# ...
oauth_config:
  redirect_urls:
    - https://1234-12-34-123-12.ngrok.io/
# ...
settings:
  event_subscriptions:
    request_url: https://1234-12-34-123-12.ngrok.io/api/slack/events
# ...
  interactivity:
    request_url: https://1234-12-34-123-12.ngrok.io/api/slack/events
# ...
```

> Note: The `event_subscriptions` URL must be validated in Slack app configuration.
> To activate the URL, Freeday must be running and listening to Slack API calls.
