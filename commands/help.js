const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Answers frequently asked questions.')
    .addStringOption(option =>
      option.setName('question')
      .setRequired(true)
      .addChoice('How do I make ChilledBot 24/7?', '1')
      .setDescription('yes')
      .addChoice('How to setup ChilledBot?', '1')
      .setDescription('yes')
      .addChoice('How do I use the DJ role?', '2')
      .setDescription('yes')
      .addChoice('How can I use ChilledBot in a stage channel?', '3')
      .setDescription('yes')
      .addChoice('Why ChilledBot doesn\'t play music?', '4')
      .setDescription('yes')
      .addChoice('ChilledBot doesn\'t answer my message, why?', '5')
      .setDescription('yes')
    )
    .addUserOption(option =>
      option.setName('user')
      .setDescription('The user to mention')
      .setRequired(false)),
  execute(interaction, client) {
    const value = interaction.options._hoistedOptions[0].value;

    async function reply(embed, user) {
      if (user) {
        interaction.reply({
          content: `<@${user}>`,
          embeds: [embed]
        })
      } else {
        interaction.reply({
          embeds: [embed]
        })
      }
    }

    const one = new Discord.MessageEmbed()
      .setAuthor({
        name: 'How do i make ChilledBot 24/7 / How to setup ChilledBot?'
      })
      .setDescription("First up, you're gonna make sure ChilledBot is added to your server, you can do this by searching for `ChilledBot#8731` in the member list. If you don't have ChilledBot, you can go to <#795035653107613716> and type `!!add`")
      .addFields({
        name: '\u200b',
        value: "Once this is done, you will have to create a voice channel that ChilledBot can access. And then type `!!join` in a text channel that ChilledBot can see"
      })
      .setColor("2f3136")

    const two = new Discord.MessageEmbed()
      .setAuthor({
        name: 'How do I use the DJ role?'
      })
      .setDescription('DJ Mode is made to only allow specific roles to use commands, you can set up dj mode by typing `!!dj on` then `!!dj add @role`')
      .addFields({
        name: '\u200b',
        value: "If you want to remove it completely, you can do `!!dj off`\nIf you want to remove a role from the dj list, you can do `!!dj remove @role`"
      })
      .setColor("2f3136")

    const three = new Discord.MessageEmbed()
      .setAuthor({
        name: 'How can I use ChilledBot in a stage channel ?'
      })
      .setDescription('First, you want to make sure your server has community enabled. To do that, go to your server setting and navigate to the "Community" tab, and enable it if not done already.')
      .addFields({
        name: '\u200b',
        value: "When that's done, create a new channel and select \"stage channel\", click Next and add ChilledBot as a stage moderator."
      }, {
        name: '\u200b',
        value: "Now you can simply do `!!join` in a text channel and it should work fine!"
      })
      .setColor("2f3136")
    const four = new Discord.MessageEmbed()
      .setAuthor({
        name: 'Why ChilledBot doesn\'t play music?'
      })
      .setDescription('If the bot has joined the voice channel but doesn\'t play music, please check that the bot has permission to talk in the channel and that the bot is not server muted.')
      .addFields({
        name: '\u200b',
        value: "If the bot doesn't respond to your messages, please check that the bot has access to your text channel and that the bot is online."
      }, {
        name: '\u200b',
        value: "And if the bot responds to your message but doesn't join the voice channel, please check that it has permission to join your voice channel."
      })
      .setColor("2f3136")

    const five = new Discord.MessageEmbed()
      .setAuthor({
        name: 'ChilledBot doesn\'t answer my message, why?'
      })
      .setDescription('If the bot has joined the voice channel but doesn\'t play music, please check that the bot has permission to talk in the channel and that the bot is not server muted.')
      .addFields({
        name: '\u200b',
        value: "If the bot doesn't respond to your messages, please check that the bot has access to your text channel and that the bot is online."
      })
      .setColor("2f3136")
    if (value === '1') {
      if (interaction.options._hoistedOptions[1]) {
        reply(one, interaction.options._hoistedOptions[1].value)
      } else {
        reply(one)
      }
    }
    if (value === '2') {
      if (interaction.options._hoistedOptions[1]) {
        reply(two, interaction.options._hoistedOptions[1].value)
      } else {
        reply(two)
      }
    }
    if (value === '3') {
      if (interaction.options._hoistedOptions[1]) {
        reply(three, interaction.options._hoistedOptions[1].value)
      } else {
        reply(three)
      }
    }
    if (value === '4') {
      if (interaction.options._hoistedOptions[1]) {
        reply(four, interaction.options._hoistedOptions[1].value)
      } else {
        reply(four)
      }
    }
    if (value === '5') {
      if (interaction.options._hoistedOptions[1]) {
        reply(five, interaction.options._hoistedOptions[1].value)
      } else {
        reply(five)
      }
    }
  }
}