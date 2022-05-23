const { getVoiceConnection } = require('@discordjs/voice');
const { Interaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function stop(interaction = Interaction) {
  const connection = getVoiceConnection(interaction.guildId);

  if (!connection) {
    interaction.reply('Nothing to stop :))');
    return;
  }

  const player = connection.state.subscription?.player;
  if (!player) {
    interaction.reply('Nothing to stop :))');
    return;
  }

  player.stop();
  interaction.reply('Stopped playing.');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops playing the current radio.'),
  async execute(interaction) { return stop(interaction); },
};
