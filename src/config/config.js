const { Client, GatewayIntentBits, Discord } = require("discord.js");
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

process.env.FFMPEG_PATH = ffmpeg.path;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

const distube = new DisTube(client, {
    emitNewSongOnly: true,
    plugins: [
        new SpotifyPlugin(),
        new YtDlpPlugin()
    ],
});

module.exports = { client, distube };
