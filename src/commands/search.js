const { searchRadios } = require('../radio-helpers.js');
const { MessageEmbed, MessageActionRow, MessageButton, Interaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const URL_CONTENT = "https://radio.garden";

async function search(interaction = Interaction) {
  const radioOption = interaction.options.get('radio');
  const radio = radioOption.value;
  if (!radio) {
    interaction.reply('You need to specify a radio name');
    return;
  }

  const radios = await searchRadios(radio);
  if (!radios) {
    interaction.reply(`No radio found for ${radio}`);
    return;
  }

  const { subtitle, title, url } = radios[0]?._source;

  const embed = new MessageEmbed()
    .setTitle(title)
    .setURL(URL_CONTENT + url)
    .setDescription(subtitle);

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(`play ${title}`)
        .setLabel('Play')
        .setStyle('PRIMARY'),
    );

  await interaction.reply({
    content: 'We found this radio:',
    embeds: [embed],
    components: [row],
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Performs a search for radios matching the input name.')
    .addStringOption(option =>
      option
        .setName('radio')
        .setRequired(true)
        .setDescription('The radio to search.'),
    ),
  async execute(interaction) { return search(interaction); },
};
