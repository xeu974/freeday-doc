# Slack

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

> Note: The `event_subscriptions` URL must be validated in Slack app configuration.
> To activate the URL, Freeday must be running and listening to Slack API calls.

Then go in the *Basic Information* section. Here you will find various credentials that need to be copied into Freeday's environment file.

Finally, go in the *Install App* page, and hit the *Install to Workspace* button. A page will open displaying the scopes granted to the Freeday app. You can validate by clicking the *Allow* button. The Bot Access Token (also needed in Freeday's environment file) will then will be displayed to you. 
