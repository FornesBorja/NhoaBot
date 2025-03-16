module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Depende si no gomito ${client.user.tag}`);
    }
};
