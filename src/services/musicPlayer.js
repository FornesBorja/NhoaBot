class MusicPlayer {
    static instance = null;

    constructor(distube) {
        if (MusicPlayer.instance) {
            return MusicPlayer.instance;
        }

        this.distube = distube;
        this.leaveTimers = new Map();
        this.initializeEvents();
        MusicPlayer.instance = this;
    }

    initializeEvents() {
        this.distube.removeAllListeners();
        
        this.distube
            .on('playSong', (queue, song) => {
                queue.textChannel.send(`**▶️ Reproduciendo: **\`${song.name}\``);
            })
            .on('addSong', (queue, song) => {
                queue.textChannel.send(`✅ Añadida \`${song.name}\` a la cola`);
                try {
                    const guildId = queue?.guild?.id;
                    if (guildId && this.leaveTimers.has(guildId)) {
                        clearTimeout(this.leaveTimers.get(guildId));
                        this.leaveTimers.delete(guildId);
                    }
                } catch (error) {
                    console.error('Error al resetear el timer:', error);
                }
            })
            .on('empty', (queue) => {
                queue.textChannel.send('El canal de voz está vacío. ¡Hasta luego! 👋');
                queue.stop();
                queue.voice.leave();
            })
            .on('finish', (queue) => {
                queue.textChannel.send('🎵 La cola de reproducción ha terminado.');
                try {
                    const guildId = queue?.guild?.id;
                    if (guildId) {
                        const timerId = setTimeout(() => {
                            if (queue.voice.channel) {
                                queue.textChannel.send('⏹️ No hay más canciones en la cola. ¡Hasta luego! 👋');
                                queue.voice.leave();
                                this.leaveTimers.delete(guildId);
                            }
                        }, 300000);
                        this.leaveTimers.set(guildId, timerId);
                    }
                } catch (error) {
                    console.error('Error al establecer el timer:', error);
                }
            });
    }

    static getInstance(distube) {
        if (!MusicPlayer.instance) {
            MusicPlayer.instance = new MusicPlayer(distube);
        }
        return MusicPlayer.instance;
    }

    getQueue(guildId) {
        return this.distube.getQueue(guildId);
    }

    async play(voiceChannel, query, options) {
        return await this.distube.play(voiceChannel, query, options);
    }

    async stop(message) {
        return await this.distube.stop(message);
    }

    async skip(message) {
        return await this.distube.skip(message);
    }
}

module.exports = MusicPlayer;
