import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", async () => {
    console.log("Discord bot logged in as " + client.user?.tag);

    if (client.guilds.cache.size > 0) {
        for (const guild of client.guilds.cache.values()) {
            await deployCommands({ guildId: guild.id });
            console.log(`Commands deployed for guild ${guild.id}`);
        }
    } else {
        console.log("Bot is not in any guilds yet");
    }
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
    console.log(`Commands deployed for new guild ${guild.id}`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands[interaction.commandName as keyof typeof commands];
    if (command) await command.execute(interaction);
});

client.login(config.BOT_TOKEN);
