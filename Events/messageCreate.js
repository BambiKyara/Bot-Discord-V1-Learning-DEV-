const Discord = require("discord.js");
const client = new Client();

module.exports = async (bot, message) => {
  console.log("event MessageCreate Envoyé");

  // PRESET LE PREFIX
  let prefix = "!";

  client.on("messageCreate", (message) => {
    // Evite le botception
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  });

  // EXIT And Stop if its not there
  if (!message.content.startsWith(prefix)) return;

  // The back ticks are Template Literals introduced in Javascript in ES6 or ES2015
  if (message.content.startsWith(`${prefix}ping`)) {
    message.channel.send("pong!");
  } else if (message.content.startsWith(`${prefix}foo`)) {
    message.channel.send("bar!");
  }
};
