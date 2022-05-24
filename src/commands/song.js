const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const { Interaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { detectSong } = require('../utils/detect-song.js');
const { OpusEncoder } = require('@discordjs/opus');

async function song(interaction = Interaction) {
  const connection = getVoiceConnection(interaction.guildId);
  const player = connection?.state?.subscription?.player;

  if (player?.state?.status == AudioPlayerStatus.Playing) {
    // const buffer = player.state?.resource?.playStream?.read(500000); // 500kb
    const buffer = player.state?.resource?.read(); // 500kb
    console.log(player.state?.resource);
    // const encoder = new OpusEncoder(41000, 1);
    // const buffer = encoder.encode(player.state?.resource?.playStream);
    console.log(buffer);
    const result = await detectSong(buffer);
    console.log(result);
    console.log('Buffering complete');
  } else {
    console.log('No player found');
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('song')
    .setDescription('Tries to find the song currently playing.'),
  async execute(interaction) { return song(interaction); },
};
