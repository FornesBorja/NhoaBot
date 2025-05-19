require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { client, distube } = require('./config/config');
const MusicPlayer = require('./services/musicPlayer');
const { searchSpotify } = require('./services/spotifyService');
const { searchYouTube } = require('./services/youtubeService');

client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('.')) return;

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('¡Hubo un error ejecutando el comando!');
    }
});

const musicPlayer = MusicPlayer.getInstance(distube);

async function handleSearch(query) {
    try {
        const spotifyResults = await searchSpotify(query);
        if (spotifyResults.length > 0) {
            console.log('Resultados de Spotify:', spotifyResults);
            return; 
        }

      
        const youtubeResults = await searchYouTube(query);
        console.log('Resultados de YouTube:', youtubeResults);
    } catch (error) {
        console.error('Error al buscar:', error);
    }
}


client.login(process.env.DISCORD_TOKEN);
