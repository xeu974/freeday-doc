# Getting started

## Slack app

TODO

## Deployment

### Docker

Freeday can be easily deployed using Docker images.

You can find below an example of `docker-compose.yaml` file and its `.env` companion.

Try it out! Edit configuration as you wish then run the whole thing using `docker-compose up -d`.

#### docker-compose.yml

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

#### .env

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

### First usage

When running Freeday for the first time, you need to go on the Welcome page so you can create the first administrator account.

Run `docker logs freeday-api` to display Freeday API logs and get the Welcome URL from there.

> Note: The Welcome URL will appear in the API logs only if there is no user in database
