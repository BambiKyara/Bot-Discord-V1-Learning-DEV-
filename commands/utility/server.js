const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server_status") // Modifiez le nom ici pour éviter les doublons
    .setDescription("Replies with the server status!"),
  async execute(interaction) {
    await interaction.reply("Server status is online!");
  },
};
