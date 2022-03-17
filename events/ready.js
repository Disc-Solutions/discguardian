module.exports = {
  name: 'ready',
  execute(client) {
    console.log('ready');
    client.user.setPresence({
      status: "dnd"
    });
  },
};