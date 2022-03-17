module.exports = {
  name: 'presenceUpdate',
  execute(oldPresence, newPresence, client) {
    async function soutien() {
      if (client.guilds.cache.get(client.config.guildId).members.cache.get(newPresence.userId)._roles.includes(client.config.roleSoutien)) return;
      client.guilds.cache.get(client.config.guildId).members.cache.get(newPresence.userId).roles.add(client.config.roleSoutien)
    }

    async function pasGentil() {
      if (!client.guilds.cache.get(client.config.guildId).members.cache.get(newPresence.userId)._roles.includes(client.config.roleSoutien)) return;
      client.guilds.cache.get(client.config.guildId).members.cache.get(newPresence.userId).roles.remove(client.config.roleSoutien)
    }

    if (newPresence.activities) {
      try {
        if (newPresence.activities[0].state) {
          if (newPresence.guild.id == client.config.guildId) {
            if (newPresence.activities[0].state.toString().toLowerCase().includes('chilledbot')) {
              try {
                soutien().catch()
              } catch {}
            } else {
              try {
                pasGentil().catch()
              } catch {}
            }
          }
        }
      } catch (e) {}
    }
  },
};