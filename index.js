const fs = require('fs');
const {
  Client,
  Collection,
  Intents,
  Options
} = require('discord.js');
const {
  GiveawaysManager
} = require('discord-giveaways');
const config = require('./config.json');

const client = new Client({
  intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  makeCache: Options.cacheWithLimits({
    MessageManager: 200,
    PresenceManager: 100,
  }),
});

const manager = new GiveawaysManager(client, {
  storage: './giveaways.json',
  default: {
    botsCanWin: false,
    embedColor: '#2f3136',
    embedColorEnd: '#202225',
    reaction: '🎉'
  }
});

client.manager = manager
client.config = config

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client, config);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
  }
});

// When someone want to participate to a giveaway

client.manager.on('giveawayReactionAdded', (giveaway, member, reaction) => {
  // If dont have the role required
  if (giveaway.messages.drawing.includes('Role required: <@&')) {
    let roleId = giveaway.messages.drawing.slice('Drawing: {timestamp}\nRole required: <@&'.length, -1)
    if(!member.roles.cache.get(roleId)) {
      reaction.users.remove(member.user);
      member.send(`You must vote on our top.gg (https://chilledbot.xyz/topgg) to participate in the giveaway`);
    }
  };
});

client.login(config.token);