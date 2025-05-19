const { distube } = require('../config/config');

// Map to store leave timers for each guild
const leaveTimers = new Map();

module.exports = {
    name: 'leave',
    async execute(message) {
        const queue = distube.getQueue(message.guild.id);

        if (!message.member.voice.channel) {
            return message.reply('¡Debes estar en un canal de voz!');
        }

        if (leaveTimers.has(message.guild.id)) {
            clearTimeout(leaveTimers.get(message.guild.id));
            leaveTimers.delete(message.guild.id);
        }

        if (queue) {
            const timerId = setTimeout(() => {
                queue.stop();
                queue.voice.leave();
                leaveTimers.delete(message.guild.id);
                return message.channel.send('👋 ¡Adiós!');
            }, 60000);
            leaveTimers.set(message.guild.id, timerId);
        } else {
            if (message.guild.members.me.voice.channel) {
                const timerId = setTimeout(() => {
                    message.guild.members.me.voice.disconnect();
                    leaveTimers.delete(message.guild.id);
                    return message.channel.send('👋 ¡Adiós!');
                }, 300000);
                leaveTimers.set(message.guild.id, timerId);
            } else {
                return message.reply('¡No estoy en ningún canal de voz!');
            }
        }
    },
    leaveTimers
}; 