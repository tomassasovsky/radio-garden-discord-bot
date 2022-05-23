# Radio Garden Discord Bot

When I discovered the [Radio Garden website](https://radio.garden), my first thought was "I need this for my discord server".

I couldn't find anything that already existed and worked properly, so I decided to code it myself.

## Getting started

First, you'll need to create a discord application. You can do that [here](https://discord.com/developers/applications).\
\
\
Click on `New Application` and give it a name.

![image](https://user-images.githubusercontent.com/63405252/169724369-35ebf3df-2a24-4bbe-adef-4965abe2906e.png)

\
\
Go to the `OAuth2` tab and copy down the `CLIENT ID` variable.

![image](https://user-images.githubusercontent.com/63405252/169724399-be747ac0-581d-43e9-8777-858a287165c8.png)

\
\
Now go to the `Bot` tab, create a bot, and copy its `Token` variable.

![image](https://user-images.githubusercontent.com/63405252/169724409-2b6b104e-8231-44c3-b3ed-5cfcd6d6cb2f.png)

Place them in a new file called `.env`. It should look like this:

```env
DISCORD_TOKEN=YOUR_DISCORD_TOKEN_HERE
CLIENT_ID=YOUR_CLIENT_ID_HERE
```

You're almost good to go...

In the `Bot` tab, set all these to true

![image](https://user-images.githubusercontent.com/63405252/169724354-d8cc02a6-044b-413c-9a57-8f640ac32032.png)
