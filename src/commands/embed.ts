import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Sendet ein Embed!")

export async function execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle("test")
        .setDescription("Dies ist ein Test!")
        .setColor(0x5DA9E9)
        .setFooter({text: "Test footer"})

    await interaction.reply({
        embeds: [embed]
    })
}