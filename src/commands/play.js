const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { distube } = require('../config/config');

// Sistema de caché optimizado
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

class MusicManager {
    constructor() {
        this.queues = new Map();
        this.playing = new Map();
        this.buffer = new Map();
        this.bufferSize = 2;
    }

    async addToQueue(guildId, track, message) {
        if (!this.queues.has(guildId)) {
            this.queues.set(guildId, []);
        }
        
        const queue = this.queues.get(guildId);
        queue.push(track);
        
        if (!this.playing.has(guildId)) {
            await this.playNext(guildId, message);
        } else {
            this.precacheNext(guildId);
        }
    }

    async playNext(guildId, message) {
        const queue = this.queues.get(guildId);
        if (!queue || queue.length === 0) {
            this.playing.delete(guildId);
            return;
        }

        const track = queue.shift();
        this.playing.set(guildId, track);
        
        try {
            await distube.play(message.member.voice.channel, track, {
                textChannel: message.channel,
                member: message.member,
            });
            
            this.precacheNext(guildId);
        } catch (error) {
            console.error('Error al reproducir:', error);
            this.playing.delete(guildId);
            await this.playNext(guildId, message);
        }
    }

    async precacheNext(guildId) {
        const queue = this.queues.get(guildId);
        if (queue && queue.length > 0) {
            const nextTrack = queue[0];
            try {
                await distube.createCustomPlaylist(nextTrack, {
                    properties: { seek: 0 }
                });
            } catch (error) {
                console.error('Error al precargar:', error);
            }
        }
    }
}

const musicManager = new MusicManager();

module.exports = {
    name: 'play',
    async execute(message, args) {
        if (!message.member.voice.channel) {
            return message.reply('¡Debes estar en un canal de voz!');
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

            await musicManager.addToQueue(message.guild.id, videoUrl, message);
            message.reply('Canción añadida a la cola! 🎵');
            
        } catch (error) {
            console.error('Error:', error);
            return message.reply('Hubo un error al intentar reproducir la canción.');
        }
    }
};
