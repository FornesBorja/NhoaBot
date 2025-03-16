const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

module.exports = {
    name: 'ping',
    async execute(message) {
        const sent = await message.reply('📡 Calculando latencias...');
        
        try {
            const botPing = sent.createdTimestamp - message.createdTimestamp;
            const apiPing = message.client.ws.ping;

            const euwServer = 'euw.api.riotgames.com';
            
            let euwPing;
            try {
                if (process.platform === 'win32') {
                    const { stdout } = await execPromise(`ping ${euwServer} -n 1`);
                    euwPing = stdout.match(/tiempo[=<](\d+)/)?.[1] || 'N/A';
                } else {
                    const { stdout } = await execPromise(`ping -c 1 ${euwServer}`);
                    euwPing = stdout.match(/time=(\d+\.\d+)/)?.[1] || 'N/A';
                }
            } catch (error) {
                euwPing = 'N/A';
            }

            const response = [
                '🏓 **Resultados del Ping:**',
                `> 🤖 Bot: \`${botPing} ms\``,
                `> 📡 Discord API: \`${apiPing} ms\``,
                `> 🎮 EUW: \`${euwPing} ms\``,
            ].join('\n');

            await sent.edit(response);

        } catch (error) {
            console.error('Error al calcular ping:', error);
            await sent.edit('❌ Hubo un error al calcular las latencias.');
        }
    }
};
