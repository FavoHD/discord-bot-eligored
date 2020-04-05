const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = process.env.prefix;
const token = process.env.token;
const ownerId = process.env.ownerId;


//Database
const {Pool} = require('pg');
 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

pool.connect();
	
pool.on('connect', () => console.log('Connected to db!'));
//Database



client.once('ready', () => {	
	client.user.setPresence({ game: { name: prefix+'help' }, status: 'online' })
	
	console.log('Ready!');
});
client.once('reconnecting', () => {
	console.log('Reconnecting!');
});
client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	
	if (message.content.toLowerCase().startsWith(`${prefix}ping`)) {
		message.channel.send('Pong!')
		return;
	} else if (message.content.toLowerCase().startsWith(`${prefix}help`)) {
		
		return;
	} else {
		message.channel.send('You need to enter a valid command!')
	}
});

client.login(token);