const { getVoiceConnection } = require('@discordjs/voice');
const { Interaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function exit(interaction = Interaction) {
  const connection = getVoiceConnection(interaction.guildId);
  const player = connection?.state?.subscription?.player;

  player?.stop();
  connection?.disconnect();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exit')
    .setDescription('Exits the voice channel.'),
  async execute(interaction) { return exit(interaction); },
};
