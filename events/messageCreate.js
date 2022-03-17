const ms = require('ms'),
  Discord = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.channel.id === client.config.suggestionChannel) {
      if (message.author.id === client.user.id) return;
      setTimeout(() => {
        message.delete()
      }, 100);
    }

    if (message.author.bot) return;
    if (!message.channel.type === "GUILD_TEXT") return;
    if (!message.content.startsWith(client.config.prefix)) return;

    const cmd = message.content.split(' ')[0].slice(client.config.prefix.length);
    const args = message.content.slice(client.config.prefix).trim().split(/ +/g);

    if (cmd === "giveaway") {
      if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return;
      let messageError = "Usage: s/giveaway <temps> <nb gagnant> <truc à gagner> [id du rôle requis]";
      if (!args[1]) return message.channel.send({
        content: messageError
      });
      if (!args[2]) return message.channel.send({
        content: messageError
      });
      if (!args[3]) return message.channel.send({
        content: messageError
      });
      let Time = parseInt(ms(args[1]));
      let Winners = parseInt(args[2]);
      if (args[3].includes('-')) args[3] = args[3].replace('-', ' ');
      let Prize = args[3];
      let roleID = args[4];

      if (!args[4]) {
        client.manager.start(message.channel, {
          duration: Time,
          winnerCount: Winners,
          prize: Prize,
          messages: {
            giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
            giveawayEnded: '**GIVEAWAY ENDED**',
            winMessage: 'Congratulations, {winners}! You won **{this.prize}**!',
          }
        }).catch();
      } else {
        client.manager.start(message.channel, {
          duration: Time,
          winnerCount: Winners,
          prize: Prize,
          exemptMembers: new Function('member', `return !member.roles.cache.some((r) => r.id === \'${roleID}\')`),
          messages: {
            giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
            giveawayEnded: '**GIVEAWAY ENDED**',
            winMessage: 'Congratulations, {winners}! You won **{this.prize}**!',
            drawing: `Drawing: {timestamp}\nRole required: <@&${roleID}>`,
          }
        }).catch();
      };
    };

    if (cmd === "server") {
      message.channel.send('Please use /suggestion !');
    };

    if (cmd === "bot") {
      message.channel.send('Please use /suggestion !');
    };

    // This is a function to clear the number of messages you want, even if they are more than 100 and older than 14 days

    if (cmd === "superclear") {
      const toDelete = message.content.split(' ').slice(1);

      async function fetchMore(channel, limit) {
        if (!channel) {
          throw new Error(`Expected channel, got ${typeof channel}.`);
        }
        if (limit <= 100) {
          return channel.messages.fetch({
            limit
          });
        }

        let collection = [];
        let lastId = null;
        let options = {};
        let remaining = limit;

        while (remaining > 0) {
          options.limit = remaining > 100 ? 100 : remaining;
          remaining = remaining > 100 ? remaining - 100 : 0;

          if (lastId) {
            options.before = lastId;
          }

          let messages = await channel.messages.fetch(options);

          if (!messages.last()) {
            break;
          }

          collection = collection.concat(messages);
          lastId = messages.last().id;
        }
        collection.remaining = remaining;

        return collection;
      }

      const list = await fetchMore(message.channel, toDelete);

      let i = 1;
      let deleted = 1;

      list.forEach(underList => {
        underList.forEach(msg => {
          i++;
          if (i < toDelete) {
            setTimeout(function () {
              msg.delete().then(m => {
                deleted++;
                console.log(`Deleted message ${m.id} | ${deleted-1}`);
              })
            }, 1500 * i)
          }
        })
      })

      function convert(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + "m " + (seconds < 10 ? '0' : '') + seconds + "s";
      }

      const converted = await convert(i * 3500);

      message.channel.send(`Deleting ${i-1} messages this will be taking ~${converted}`)
    }

    // Basic clear command

    if (cmd === "clear") {
      number = message.content.split(' ').slice(1);
      if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return;
      if (number[0] === "all") {
        message.channel.send(`Tous les messages du channel seront supprimés ! Pour confirmer, tapez \`confirm\`.`);
        await message.channel.awaitMessages((m) => (m.author.id === message.author.id) && (m.content === "confirm"), {
          max: 1,
          time: 20000,
          errors: ["time"]
        }).catch(() => {
          return message.channel.send(':warning: Le temps est écoulé ! Veuillez envoyer à nouveau la commande !')
        });
        let position = message.channel.rawPosition;
        let newChannel = await message.channel.clone();
        await message.channel.delete();
        newChannel.setPosition(position);
        return newChannel.send("Salon nettoyé !");
      };
      let amount = number[0];
      if (!amount || isNaN(amount) || parseInt(amount) < 1) {
        return message.channel.send(':x: Vous devez préciser un nombre de messages à supprimer !');
      };
      await message.delete();
      const user = message.mentions.users.first();
      let messages = await message.channel.messages.fetch({
        limit: amount
      });
      if (user) {
        messages = messages.filter((m) => m.author.id === user.id);
      };
      messages = messages.filter((m) => !m.pinned);
      message.channel.bulkDelete(messages, true);
      let toDelete = null;
      if (user) {
        toDelete = await message.channel.send(`**${--amount}** des messages de **${user.tag}** ont été supprimé`);
      } else {
        toDelete = await message.channel.send(`**${--amount}** messages supprimés`);
      };
      setTimeout(function () {
        toDelete.delete();
      }, 2000);
    };
  },
};