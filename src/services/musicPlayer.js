class MusicPlayer {
    static instance = null;

    constructor(distube) {
        if (MusicPlayer.instance) {
            return MusicPlayer.instance;
        }

        this.distube = distube;
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
            })
            .on('empty', (queue) => {
                queue.textChannel.send('El canal de voz está vacío. ¡Hasta luego! 👋');
                queue.stop();
                queue.voice.leave();
            })
            .on('finish', (queue) => {
                queue.textChannel.send('No hay más canciones en la cola. ¡Hasta luego! 👋');
                queue.voice.leave();
            });
    }

    static getInstance(distube) {
        if (!MusicPlayer.instance) {
            MusicPlayer.instance = new MusicPlayer(distube);
        }
        return MusicPlayer.instance;
    }

    // Podemos agregar más métodos útiles aquí
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
