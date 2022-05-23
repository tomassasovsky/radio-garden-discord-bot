const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
  new SlashCommandBuilder().setName('play').setDescription('Plays a given radio if found.').addStringOption(option =>
    option.setName('radio').setRequired(true).setDescription('The radio to play.')
  ),
  new SlashCommandBuilder().setName('search').setDescription('Performs a search for radios matching the input name.').addStringOption(option =>
    option.setName('radio').setRequired(true).setDescription('The radio to play.')
  ),
  new SlashCommandBuilder().setName('stop').setDescription('Stops playing the current radio.'),
  new SlashCommandBuilder().setName('exit').setDescription('Exits the voice channel.')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

async function updateCommands() {
  const previousCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));

  const promises = [];
  for (const command of previousCommands) {
    const deleteUrl = `${Routes.applicationCommands(process.env.CLIENT_ID)}/${command.id}`;
    promises.push(rest.delete(deleteUrl));
  }
  await Promise.all(promises).catch(console.error);

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
    .catch(console.error);
}

module.exports = {
  updateCommands
};
