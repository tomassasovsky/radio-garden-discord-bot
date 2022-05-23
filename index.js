require('dotenv').config()

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');

// create the client
const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS];
const client = new Client({ intents: intents });

// register commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

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
