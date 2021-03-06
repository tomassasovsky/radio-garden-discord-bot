const { radioByName } = require('../utils/radio-helpers.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const URL_LISTEN = "https://radio.garden/api/ara/content/listen/";
const URL_CONTENT = "https://radio.garden";

const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  getVoiceConnection,
  AudioPlayerStatus,
} = require('@discordjs/voice');

const { MessageEmbed, Interaction, MessageActionRow, MessageButton } = require('discord.js');

async function play(interaction = Interaction) {
  if (!interaction.member.voice.channelId) {
    interaction.reply({
      content: 'You must be in a voice channel to use this command.',
      ephemeral: true
    });
    return;
  }

  const radioOption = interaction.options?.get('radio');
  const { customId } = interaction;

  let radio;

  console.log('value: ', radioOption?.value);
  console.log('customid: ', customId);
  console.log('option values: ', radioOption?.values);

  if (radioOption) {
    radio = radioOption?.value;
  } else if (customId) {
    if (interaction.values) {
      radio = interaction.values[0];
    } else {
      const indexOfSpace = customId.indexOf(' ');
      radio = customId.substring(indexOfSpace + 1);
    }
  }

  console.log(radio);

  if (!radio) {
    interaction.reply({
      content: 'You need to specify a radio name',
      ephemeral: true
    });
    return;
  }

  const result = await radioByName(radio);
  if (!result) {
    interaction.reply({
      content: `No radio found for ${radio}`,
      ephemeral: true,
    });
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

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId(`play ${title}`)
          .setStyle('PRIMARY')
          .setEmoji('????')
      )

    console.log(`Starting to play: ${title, subtitle, sourceUrl}`);

    player.on('error', async error => {
      console.error(error);
      await player.disconnect();
      await interaction.reply({
        content: 'An error occurred while playing the radio.',
        ephemeral: true,
      });
      return;
    });

    await interaction.reply({
      content: 'Playing...',
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
  }

  if (wasConnected) {
    await play();
  } else {
    connection.once(VoiceConnectionStatus.Ready, play);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a given radio if found.')
    .addStringOption(option =>
      option
        .setName('radio')
        .setRequired(true)
        .setDescription('The radio to play.'),
    ),
  async execute(interaction) { return play(interaction); },
};
