const { searchRadios } = require('../utils/radio-helpers.js');
const { MessageEmbed, MessageActionRow, MessageButton, Interaction, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const URL_CONTENT = "https://radio.garden";

async function search(interaction = Interaction) {
  const radioOption = interaction.options.get('radio');
  const { value } = radioOption;
  if (!value) {
    interaction.reply('You need to specify a radio name');
    return;
  }

  const radios = await searchRadios(value);
  if (!radios || radios.length === 0) {
    interaction.reply(`No radio found for ${value}`);
    return;
  }

  const row = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('play')
        .setPlaceholder('Nothing selected')
    )

  for (const radio of radios.slice(0, 10)) {
    const { subtitle, title } = radio._source;

    row.components[0].addOptions([
      {
        label: title,
        description: subtitle,
        value: title,
      },
    ]);
  }

  await interaction.reply({
    content: 'We found these radios:',
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
