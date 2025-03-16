const { distube } = require('../config/config');

module.exports = {
    name: 'leave',
    async execute(message) {
        const queue = distube.getQueue(message.guild.id);
        
        if (!message.member.voice.channel) {
            return message.reply('¡Debes estar en un canal de voz!');
        }

        if (queue) {
            queue.stop();
            queue.voice.leave();
            return message.channel.send('👋 ¡Adiós!');
        } else {
            if (message.guild.members.me.voice.channel) {
                message.guild.members.me.voice.disconnect();
                return message.channel.send('👋 ¡Adiós!');
            } else {
                return message.reply('¡No estoy en ningún canal de voz!');
            }
        }
    }
}; 