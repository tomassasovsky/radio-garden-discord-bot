require('dotenv').config()

const { Client, Intents } = require('discord.js');

const {
  updateCommands,
  exitHandler,
  playHandler,
  stopHandler,
  searchHandler
} = require('./src/index.js');

async function main() {
  const intents = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
  ];
  const client = new Client({ intents: intents });

  client.on('ready', updateCommands);

  client.on('interactionCreate', async interaction => {
    const { commandName, customId } = interaction;

    console.log(`Received: ${commandName, customId}`);

    const commandHandlers = {
      'play': playHandler,
      'search': searchHandler,
      'stop': stopHandler,
      'exit': exitHandler,
    }

    const handler = commandHandlers[commandName ?? customId?.split(' ')[0]];
    return handler(interaction) ?? interaction.reply(`Unknown command: ${commandName}`);
  });

  await client.login(process.env.DISCORD_TOKEN);
}

main();
