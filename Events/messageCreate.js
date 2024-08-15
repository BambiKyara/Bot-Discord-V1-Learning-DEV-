const { Client, GatewayIntentBits } = require("discord.js");
const config = require("../config.json");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

module.exports = async (bot, message) => {
  console.log("event MessageCreate Envoyé");

  // PRESET LE PREFIX
  let prefix = "!";

  client.on("messageCreate", (message) => {
    // Ignore les messages qui ne commencent pas par le préfixe ou qui proviennent d'un bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.content.indexOf(config.prefix) !== 0) return;
    // Extrait les arguments et la commande à partir du message
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // EXIT And Stop if its not there
    if (!message.content.startsWith(config.prefix)) return;

    // The back ticks are Template Literals introduced in Javascript in ES6 or ES2015
    if (command === "ping") {
      message.channel.send("Pong!");
    } else if (command === "blah") {
      message.channel.send("Meh.");
      // Userinfo command
      if (command === "userinfo") {
        const user = message.author;
        const embed = {
          color: 0x0099ff,
          title: "User Info",
          fields: [
            {
              name: "Username",
              value: user.username,
              inline: true,
            },
            {
              name: "ID",
              value: user.id,
              inline: true,
            },
            {
              name: "Account Created",
              value: user.createdAt.toDateString(),
              inline: true,
            },
          ],
          timestamp: new Date(),
        };

        message.channel.send({ embeds: [embed] });
      }
    }
  });

  client.login(config.token);
};
