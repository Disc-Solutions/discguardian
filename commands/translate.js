const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const translate = require("deepl");
const emojiFlags = require('emoji-flags');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate a message to english.')
    .addStringOption(option =>
      option.setName('message')
      .setDescription('The message to translate')
      .setRequired(true)),
  async execute(interaction, client) {
    translate({
      free_api: true,
      text: interaction.options.getString('message'),
      target_lang: 'EN',
      auth_key: client.config.deeplApiKey,
    }).then(async result => {
      const flag = await emojiFlags.countryCode(result.data.translations[0].detected_source_language)

      interaction.reply({
        embeds: [{
          "title": "Translate",
          "description": `Input lang: ${flag.emoji}\nInput text: \`${interaction.options.getString('message')}\``,
          "color": "2f3136",
          "fields": [{
            "name": "Translated Text:",
            "value": `\`\`\`${result.data.translations[0].text}\`\`\``
          }],
          "footer": {
            "text": client.user.username,
            "icon_url": client.user.avatarURL({
              dynamic: true
            })
          }
        }],
        ephemeral: true
      })
    })
  },
};