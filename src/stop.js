const { getVoiceConnection } = require('@discordjs/voice');
const { Interaction } = require('discord.js');

async function stopHandler(interaction = Interaction) {
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
  stopHandler
};