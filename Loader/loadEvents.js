const { executionAsyncRessource } = require("async_hooks");
const fs = require("fs");
const messageCreate = require("../Events/messageCreate");

module.exports = (client) => {
  const eventFiles = fs
    .readdirSync("./Events")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`../Events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
};
