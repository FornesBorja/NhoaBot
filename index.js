const Discord = require("discord.js");
const { DisTube } = require('distube');
const dotenv = require("dotenv").config();
const {Client, GatewayIntentBits } = require("discord.js");
const { SpotifyPlugin } = require('@distube/spotify');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
process.env.FFMPEG_PATH = ffmpeg.path;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.MessageContent,
    ],
});

const distube = new DisTube(client, { 
    emitNewSongOnly: true,
    plugins: [new SpotifyPlugin()]
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('.play')) return;
    const args = message.content.split(' ').slice(1);
    if (!message.member.voice.channel) {
        return message.reply('¡Debes estar en un canal de voz!');
    }

    const query = args.join(' ');
    if (!query) return message.reply('Debes escribir el nombre de una canción o un enlace.');

    distube.play(message.member.voice.channel, query, {
        textChannel: message.channel,
        member: message.member,
    });
});


client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
    console.log(`Depende si no gomito ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.content === 'ping') {
        message.reply('pong');
    }
});

