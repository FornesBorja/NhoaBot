const Discord = require("discord.js");
const { DisTube } = require('distube');
const dotenv = require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const ytdl = require('ytdl-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
process.env.FFMPEG_PATH = ffmpeg.path;
const ytSearch = require('yt-search');

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
    plugins: [
        new SpotifyPlugin(),
        new YtDlpPlugin()
    ],
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('.play')) return;

    const args = message.content.split(' ').slice(1);
    if (!message.member.voice.channel) {
        return message.reply('¡Debes estar en un canal de voz!');
    }

    const query = args.join(' ');
    if (!query) return message.reply('Debes escribir el nombre de una canción o un enlace.');

    try {
        
        if (ytdl.validateURL(query)) {
            message.reply('Reproduciendo canción: ' + query);
            await distube.play(message.member.voice.channel, query, {
                textChannel: message.channel,
                member: message.member,
            });
        } else {

            console.log('Buscando canción: ' + query);

            const results = await ytSearch(query); 
            if (!results || !results.videos || results.videos.length === 0) {
                return message.reply('No pude encontrar ninguna canción con ese nombre.');
            }

            const videoUrl = results.videos[0].url;

            await distube.play(message.member.voice.channel, videoUrl, {
                textChannel: message.channel,
                member: message.member,
            });
            message.channel.send(`Reproduciendo: ${results.videos[0].title}`);
        }
    } catch (error) {
        console.error('Error al intentar reproducir la canción:', error);
        return message.reply('Hubo un error al intentar reproducir la canción. Intenta de nuevo más tarde.');
    }
});
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('.skip')) return;

    if (!message.member.voice.channel) {
        return message.reply('¡Debes estar en un canal de voz para saltar la canción!');
    }

    const queue = distube.getQueue(message.guild.id);
    
    if (!queue) {
        return message.reply('No hay ninguna canción en la cola.');
    }

    try {
        if (queue.songs.length > 1) {
            await distube.skip(message);
            message.channel.send('⏭️ **Canción saltada**. Reproduciendo la siguiente en la cola.');
        } else {
            distube.stop(message);
            message.channel.send('⏹️ No hay más canciones en la cola. El bot ha salido del canal.');
        }
    } catch (error) {
        console.error('Error al intentar saltar la canción:', error);
        message.reply('No se pudo saltar la canción. Puede que no haya más canciones en la cola.');
    }
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
