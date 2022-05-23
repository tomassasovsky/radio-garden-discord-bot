const { radioByName } = require('./radio-helpers.js');

const URL_LISTEN = "https://radio.garden/api/ara/content/listen/";
const URL_CONTENT = "https://radio.garden";

const {
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  getVoiceConnection,
  AudioPlayerStatus,
  AudioPlayerEvents,
} = require('@discordjs/voice');

const { MessageEmbed, Interaction } = require('discord.js');

async function playHandler(interaction = Interaction) {
  if (!interaction.member.voice.channelId) {
    interaction.reply('You must be in a voice channel to use this command.');
    return;
  }

  const radioOption = interaction.options?.get('radio');
  const radio = radioOption?.value ?? interaction.customId?.substring(5);
  if (!radio) {
    interaction.reply('You need to specify a radio name');
    return;
  }

  const result = await radioByName(radio);
  if (!result) {
    interaction.reply(`No radio found for ${radio}`);
    return;
  }

  const { subtitle, title, url } = result;

  const splitUrl = url.split('/');
  const urlId = splitUrl[splitUrl.length - 1];

  let wasConnected = true;

  let connection = getVoiceConnection(interaction.guildId);
  if (!connection) {
    console.log('No voice connection found, creating one');
    wasConnected = false;
    connection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.channel.guild.voiceAdapterCreator,
    });
  }

  const play = async () => {
    let player = connection.state.subscription?.player;
    if (!player) {
      console.log('No player found, creating one');
      player = createAudioPlayer();
      connection.subscribe(player);
    }

    const sourceUrl = `${URL_LISTEN}${urlId}/channel.mp3`;

    if (player.state == AudioPlayerStatus.Paused) {
      console.log('Player is disconnected, connecting');
      await player.connect();
    }

    if (player.checkPlayable()) {
      player.stop();
    }

    resource = createAudioResource(sourceUrl);
    player.play(resource);

    const embed = new MessageEmbed()
      .setTitle(title)
      .setURL(URL_CONTENT + url)
      .setDescription(subtitle);

    console.log(`Starting to play: ${title, subtitle, sourceUrl}`);

    player.on('error', async error => {
      console.error(error);
      await player.disconnect();
      await interaction.reply('An error occurred while playing the radio.');
    });

    await interaction.reply({ content: 'Playing...', embeds: [embed] });
  }

  if (wasConnected) {
    await play();
  } else {
    connection.on(VoiceConnectionStatus.Ready, play);
  }
}

module.exports = {
  playHandler
};