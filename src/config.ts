// @ts-ignore
import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is required");
}

if (!DISCORD_CLIENT_ID) {
    throw new Error("DISCORD_CLIENT_ID is required");
}

export const config = {
    BOT_TOKEN,
    DISCORD_CLIENT_ID
};
