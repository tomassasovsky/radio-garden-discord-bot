const { radioByName } = require('./radio-helpers.js');

const URL_LISTEN = "https://radio.garden/api/ara/content/listen/";
const URL_CONTENT = "https://radio.garden";

const {
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  getVoiceConnection
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
      player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Stop,
        },
      });
      connection.subscribe(player);
    }

    const sourceUrl = `${URL_LISTEN}${urlId}/channel.mp3`;

    player.stop();

    resource = createAudioResource(sourceUrl, { inlineVolume: true });
    resource.volume.setVolume(1);
    player.play(resource);

    const embed = new MessageEmbed()
      .setTitle(title)
      .setURL(URL_CONTENT + url)
      .setDescription(subtitle);

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