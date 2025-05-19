const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { distube } = require('../config/config');
const { leaveTimers } = require('./leave');

// Sistema de caché optimizado
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

module.exports = {
    name: 'play',
    async execute(message, args) {
        if (!message.member.voice.channel) {
            return message.reply('¡Debes estar en un canal de voz!');
        }

        if (leaveTimers.has(message.guild.id)) {
            clearTimeout(leaveTimers.get(message.guild.id));
            leaveTimers.delete(message.guild.id);
        }

        const query = args.join(' ');
        if (!query) return message.reply('Debes escribir el nombre de una canción o un enlace.');

        try {
            let videoUrl;
            
            if (searchCache.has(query)) {
                const cached = searchCache.get(query);
                if (Date.now() - cached.timestamp < CACHE_DURATION) {
                    videoUrl = cached.url;
                }
            }

            if (!videoUrl) {
                if (ytdl.validateURL(query)) {
                    videoUrl = query;
                } else {
                    const results = await ytSearch(query);
                    if (!results?.videos?.length) {
                        return message.reply('No pude encontrar ninguna canción con ese nombre.');
                    }
                    videoUrl = results.videos[0].url;
                    
                    searchCache.set(query, {
                        url: videoUrl,
                        timestamp: Date.now()
                    });
                }
            }

            await distube.play(message.member.voice.channel, videoUrl, {
                member: message.member,
                textChannel: message.channel,
                message
            });
            
            message.reply('🎵 Reproduciendo la canción!');
            
        } catch (error) {
            console.error('Error:', error);
            return message.reply('Hubo un error al intentar reproducir la canción.');
        }
    }
};
