module.exports = {
  name: "guildMemberAdd",
  execute(member, client) {
    if (member.guild.id === client.config.guildId) {
      try {
        member.roles.add(client.config.autoRole)
      } catch {}

      client.channels.cache.get(client.config.autoRole).send({
        content: `${member}`
      }).then(m => {
        m.delete()
      })
    }
  }
}