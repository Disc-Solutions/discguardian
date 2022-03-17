const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with the ping of the bot.'),
  async execute(interaction, client) {
    return interaction.reply(`Pong! ${client.ws.ping}ms`);
  },
};