const { Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv").config();
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    plugins: [
        new SpotifyPlugin(),
        new YtDlpPlugin(),
    ],
});

const fs = require("fs");
const path = require("path");

fs.readdirSync("./events").forEach(file => {
    const event = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, (...args) => event(client, ...args));
});

client.login(process.env.DISCORD_TOKEN);
