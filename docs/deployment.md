# Deployment

## Docker

Freeday can be easily deployed using Docker images.

You can find below an example of `docker-compose.yaml` file and its `.env` companion.

Edit configuration as you wish then run the whole thing using `docker compose up -d`.

### docker-compose.yml

```yaml
version: '3'

services:
  freeday:
    image: freedayapp/freeday:latest
    container_name: freeday
    restart: always
    env_file:
      - .env
    networks:
      - freeday-network
    ports:
      - 8787:8787
  mongo:
    image: mongo
    container_name: mongo
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

# Environment (prod or dev)
# If prod router will serve the web client build
ENVIRONMENT=prod

# Public URL on which Freeday is reachable
PUBLIC_URL=https://freeday.domain.com/

# Port on which Freeday API will run
PORT=8787

# Path to logs directory
LOG_DIR=/var/log/freeday

##
## Database
##

# Mongo database URL
MONGO_URL=mongodb://mongo:27017/freeday

# Mongo test database URL
# This database is used when running tests
# Not required in production
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
#DIALOGFLOW_KEYFILE=/path/to/keyfile.json
#DIALOGFLOW_ENDPOINT=europe-west1-dialogflow.googleapis.com
#DIALOGFLOW_PROJECT=my-project
#DIALOGFLOW_LOCATION=europe-west1
#DIALOGFLOW_ENVIRONMENT=production
#DIALOGFLOW_USER=my-user
#DIALOGFLOW_SESSION=1234
#DIALOGFLOW_LANGUAGE=en
```

## Production

### Reverse proxy

When deploying Freeday in production, it is recommended to have a single domain pointing to your server,
and a reverse proxy distributing the app.

Let's say you're using this configuration:

```shell
PUBLIC_URL=https://freeday.domain.com/
```

Then your Nginx reverse proxy configuration would look like this:

```nginx
server {
  listen 80;
  listen [::]:80;

  server_name freeday.domain.com;

  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;
  listen [::]:443 ssl;

  server_name freeday.domain.com;

  ssl_certificate /path/to/ssl/fullchain.pem;
  ssl_certificate_key /path/to/ssl/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:8787;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
  }
}
```

## Localhost

When running Freeday on localhost, some additional steps are required so everything works properly.

### Slack bot

In a local environment, the Freeday API URL will be something like `http://localhost:8787/`.
The problem is that Slack API can't reach your Freeday instance through this URL.
Therefore you need to setup some kind of proxy / tunnel and set the correct URL in the Slack app manifest so it ca communicates with your Freeday instance.

Here we're gonna use [Ngrok](https://ngrok.com/).

#### Running Ngrok

Start a Ngrok tunnel targetting the API port (default is `8787`).

```shell
ngrok http 8787
```

Then get the tunnel `https` URL in the Ngrok console. It should look like this: `https://1234-12-34-123-12.ngrok.io`.

#### Configuring Slack app

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
