const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Make a suggestion for the server or for ChilledBot.')
    .addStringOption(option =>
      option.setName('type')
      .setDescription('Select the type of your suggestion')
      .setRequired(true)
      .addChoice('Server', 'server')
      .addChoice('Bot', 'bot'))
    .addStringOption(option =>
      option.setName('input')
      .setDescription('The input to echo back')
      .setRequired(true)),
  async execute(interaction, client) {
    function sendSuggestion(embed) {
      client.channels.cache.get(client.config.suggestionChannel).send({
        embeds: [embed]
      }).then(m => {
        interaction.reply({
          content: '<:discCheck:860256154398752789>',
          ephemeral: true
        })
        m.react(client.config.emojis.check)
        m.react(client.config.emojis.x)
      })
    }

    if (interaction.options._hoistedOptions[0].value == "server") {
      let sug = interaction.options._hoistedOptions[1].value;
      let user = client.users.cache.get(interaction.user.id)

      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: 'Server Suggestion',
          iconURL: 'https://i.imgur.com/UwBQMpZ.png'
        })
        .setDescription(sug)
        .setFooter({
          text: `Suggestion by : ${user.tag}`,
          iconURL: user.avatarURL({
            dynamic: true,
            format: 'gif',
            size: 128
          })
        })
        .setTimestamp()
        .setColor("2f3136")

      sendSuggestion(embed)
    }
    if (interaction.options._hoistedOptions[0].value == "bot") {
      let sug = interaction.options._hoistedOptions[1].value;
      let user = client.users.cache.get(interaction.user.id)

      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: 'Bot Suggestion',
          iconURL: 'https://i.imgur.com/wvvi8dS.png'
        })
        .setDescription(sug)
        .setFooter({
          name: `Suggestion by : ${user.tag}`,
          iconURL: user.avatarURL({
            dynamic: true,
            format: 'gif',
            size: 128
          })
        })
        .setTimestamp()
        .setColor("2f3136")

      sendSuggestion(embed)
    }
  },
};