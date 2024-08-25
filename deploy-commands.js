const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
const commandNames = new Set();

// Fonction récursive pour lire les commandes dans les sous-dossiers
function readCommands(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // Si c'est un dossier, l'explorer récursivement
      readCommands(fullPath);
    } else if (file.endsWith(".js")) {
      try {
        const command = require(fullPath);
        if ("data" in command && "execute" in command) {
          const commandName = command.data.name;
          if (commandNames.has(commandName)) {
            console.log(
              `[WARNING] Duplicate command name detected: ${commandName}`
            );
          } else {
            commandNames.add(commandName);
            commands.push(command.data.toJSON());
          }
        } else {
          console.log(
            `[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`
          );
        }
      } catch (error) {
        console.error(`Error loading command ${fullPath}: ${error.message}`);
      }
    }
  }
}

// Commencez à lire les commandes à partir du dossier principal
const commandsPath = path.join(__dirname, "commands");
readCommands(commandsPath);

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// Deploy your commands
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(`Error deploying commands: ${error.message}`);
  }
})();
