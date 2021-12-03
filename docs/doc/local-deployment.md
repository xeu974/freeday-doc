# Local deployment

When deploying Freeday on a local environment, some additional steps are require so everything works properly.

In a local environment, the Freeday URL will be something like `http://localhost:8788/`.
The problem is that Slack API can't reach your Freeday instance through this URL.
Therefore you need to setup some kind of proxy / tunnel and set the correct URL in the Slack app manifest so it ca communicates with your Freeday instance.

Here we're gonna use [Ngrok](https://ngrok.com/).

## Running Ngrok

Start a Ngrok tunnel targetting the API port (default is `8787`).

```shell
ngrok http 8787
```

Then get the tunnel `https` URL in the Ngrok console. It should look like this: `https://1234-12-34-123-12.ngrok.io`.

## Configuring Slack app

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
