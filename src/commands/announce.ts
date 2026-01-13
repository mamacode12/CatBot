import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ColorResolvable } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Sendet eine schicke Ankündigung mit vielen Pings.')
    .addStringOption(option =>
        option.setName('titel')
            .setDescription('Die Überschrift deiner Ankündigung.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('inhalt')
            .setDescription('Der Text. (Nutze \\n für neue Zeilen)')
            .setRequired(true)
    )
    .addAttachmentOption(option =>
        option.setName('bild')
            .setDescription('Optional: Großes Bild unten anhängen.')
            .setRequired(false)
    )
    .addStringOption(option =>
        option.setName('farbe')
            .setDescription('Hex-Code für die Farbe (z.B. #FF0000).')
            .setRequired(false)
    )
    // --- Mehrere Rollen-Slots (Optional) ---
    .addRoleOption(option => option.setName('rolle1').setDescription('1. Rolle zum Pingen').setRequired(false))
    .addRoleOption(option => option.setName('rolle2').setDescription('2. Rolle zum Pingen').setRequired(false))
    .addRoleOption(option => option.setName('rolle3').setDescription('3. Rolle zum Pingen').setRequired(false))
    // --- Mehrere User-Slots (Optional) ---
    .addUserOption(option => option.setName('user1').setDescription('1. User zum Pingen').setRequired(false))
    .addUserOption(option => option.setName('user2').setDescription('2. User zum Pingen').setRequired(false))
    .addUserOption(option => option.setName('user3').setDescription('3. User zum Pingen').setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
    // 1. Inputs holen
    const titleInput = interaction.options.getString('titel', true);
    const contentInput = interaction.options.getString('inhalt', true).split('\\n').join('\n');
    const imageAttachment = interaction.options.getAttachment('bild');
    let colorInput = interaction.options.getString('farbe');

    // Wir sammeln alle möglichen Pings in Arrays
    const roles = [
        interaction.options.getRole('rolle1'),
        interaction.options.getRole('rolle2'),
        interaction.options.getRole('rolle3')
    ];
    const users = [
        interaction.options.getUser('user1'),
        interaction.options.getUser('user2'),
        interaction.options.getUser('user3')
    ];

    // 2. Farb-Logik
    let embedColor: ColorResolvable = '#3498db';
    if (colorInput) {
        if (!colorInput.startsWith('#')) colorInput = `#${colorInput}`;
        const hexRegex = /^#[0-9A-F]{6}$/i;
        if (hexRegex.test(colorInput)) {
            embedColor = colorInput as ColorResolvable;
        }
    }

    // 3. Ping-Nachricht bauen
    // Wir gehen die Listen durch und fügen alles zusammen, was nicht "null" (leer) ist
    let pingMessage = '';

    for (const role of roles) {
        if (role) pingMessage += `${role.toString()} `;
    }

    for (const user of users) {
        if (user) pingMessage += `${user.toString()} `;
    }

    // 4. Embed bauen
    const announceEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(titleInput)
        .setDescription(contentInput)
        // Unterschrift mit deinem Namen & Bild (Footer)
        .setFooter({
            text: `Gesendet von ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

    if (imageAttachment && imageAttachment.contentType?.startsWith('image/')) {
        announceEmbed.setImage(imageAttachment.url);
    }

    // 5. Senden
    await interaction.reply({ content: '✅ Ankündigung gesendet!', ephemeral: true });

    if (interaction.channel) {
        await interaction.channel.send({
            content: pingMessage.trim(), // trim() entfernt überflüssige Leerzeichen am Ende
            embeds: [announceEmbed]
        });
    }
}