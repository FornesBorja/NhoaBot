const Discord = require("discord.js");
const dotenv = require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
    ],
});


client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
    console.log(`Depende si no gomito ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.content === 'ping') {
        message.reply('pong');
    }
});

