const { getVoiceConnection } = require('@discordjs/voice');
const { Interaction } = require('discord.js');

async function exitHandler(interaction = Interaction) {
  const connection = getVoiceConnection(interaction.guildId);

  if (!connection) {
    interaction.reply('No connections.');
    return;
  }

  const player = connection.state.subscription?.player;
  player?.stop();

  connection.disconnect();

  interaction.reply('Stopped playing.');
}

module.exports = {
  exitHandler
};