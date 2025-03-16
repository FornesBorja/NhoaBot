const { distube } = require('../config/config');

module.exports = {
    name: 'skip',
    async execute(message) {
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
                await distube.stop(message);
                message.guild.members.me.voice.disconnect();
                message.channel.send('⏹️ No hay más canciones en la cola. ¡Hasta luego! 👋');
            }
        } catch (error) {
            console.error('Error al intentar saltar la canción:', error);
            message.reply('No se pudo saltar la canción. Puede que no haya más canciones en la cola.');
        }
    }
};

