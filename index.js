require('dotenv').config()
require('./src/utils/deploy-commands.js')
const { setClientCommands } = require('./src/utils/set-client-commands.js')

const { Client, Intents } = require('discord.js');

// create the client
const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS];
const client = new Client({ intents: intents });

// register commands
setClientCommands(client);

// register events
client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
  // parse the command
  const command = client.commands.get(
    interaction.commandName ?? customId?.split(' ')[0]
  );

  if (!command) return;

  try {
    // execute the command
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
  }
});


client.login(process.env.DISCORD_TOKEN);
