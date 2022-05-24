const { getVoiceConnection } = require('@discordjs/voice');
const { Interaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function stop(interaction = Interaction) {
  const connection = getVoiceConnection(interaction.guildId);

  if (!connection) {
    interaction.reply({
      content: 'Nothing to stop :))',
      ephemeral: true,
    });
    return;
  }

  const player = connection.state.subscription?.player;
  if (!player) {
    interaction.reply({
      content: 'Nothing to stop :))',
      ephemeral: true,
    });
    return;
  }

  player.stop();
  interaction.reply({
    content: 'Stopped playing.',
    ephemeral: true,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops playing the current radio.'),
  async execute(interaction) { return stop(interaction); },
};
