const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { distube } = require('../config/config');

module.exports = {
    name: 'play',
    async execute(message, args) {
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
                const results = await ytSearch(query);
                if (!results?.videos?.length) {
                    return message.reply('No pude encontrar ninguna canción con ese nombre.');
                }

                const videoUrl = results.videos[0].url;
                await distube.play(message.member.voice.channel, videoUrl, {
                    textChannel: message.channel,
                    member: message.member,
                });
            }
        } catch (error) {
            console.error('Error al intentar reproducir la canción:', error);
            return message.reply('Hubo un error al intentar reproducir la canción. Intenta de nuevo más tarde.');
        }
    }
};
