const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const config = require("../config.json"); // Assure-toi que le chemin est correct

// Initialisation du client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages, // Nécessaire pour gérer les DM
  ],
  partials: ["CHANNEL"], // Nécessaire pour les messages DM
});

// Quand le bot est prêt
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Gestion des messages
client.on("messageCreate", async (message) => {
  // Ignore les messages envoyés par le bot lui-même
  if (message.author.bot) return;

  // Gestion des messages directs
  if (message.channel.type === "DM") {
    try {
      // Récupère le serveur à partir de l'ID
      const guild = client.guilds.cache.get(config.guildId);
      if (!guild) {
        console.error("Serveur introuvable avec guildId :", config.guildId);
        return;
      }

      // Crée un nouveau canal pour le ticket
      const ticketChannel = await guild.channels.create({
        name: `ticket-${message.author.username}`,
        type: ChannelType.GuildText,
        parent: config.ticketCategoryId, // Catégorie pour les tickets
        topic: `Ticket pour ${message.author.tag}`,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: ["ViewChannel"],
          },
          {
            id: message.author.id,
            allow: ["ViewChannel", "SendMessages"],
          },
          {
            id: config.supportRoleId, // Rôle de support
            allow: ["ViewChannel", "SendMessages"],
          },
        ],
      });

      // Envoie un message dans le canal de ticket
      await ticketChannel.send(
        `Nouveau ticket créé par ${message.author.tag}.\n\nMessage : ${message.content}`
      );
      // Informe l'utilisateur que le ticket a été ouvert
      await message.author.send(
        `Votre ticket a été ouvert : ${ticketChannel.name}.`
      );
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error);
      await message.author.send(
        "Une erreur est survenue lors de l'ouverture de votre ticket. Veuillez réessayer plus tard."
      );
    }
    return; // Assure-toi de ne pas continuer à traiter ce message pour les commandes
  }

  // Gestion des commandes dans les serveurs
  const prefix = config.prefix;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  try {
    if (command === "ping") {
      await message.channel.send("Pong!");
    } else if (command === "userinfo") {
      const user = message.author;
      const embed = {
        color: 0x0099ff,
        title: "User Info",
        fields: [
          { name: "Username", value: user.username, inline: true },
          { name: "ID", value: user.id, inline: true },
          {
            name: "Account Created",
            value: user.createdAt.toDateString(),
            inline: true,
          },
        ],
        timestamp: new Date(),
      };
      await message.channel.send({ embeds: [embed] });
    }
    // Ajoute d'autres commandes ici
  } catch (error) {
    console.error("Erreur lors de l'exécution de la commande :", error);
    await message.channel.send(
      "Une erreur est survenue lors de l'exécution de la commande."
    );
  }
});

// Connexion du bot
client.login(config.token);
