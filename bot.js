const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = process.env.prefix;
const token = process.env.token;
const ownerId = process.env.ownerId;


//Database
var mysql = require('mysql');
var connection = mysql.createConnection({
  	host     : 'v12018035925062710.yourpserver.net',
  	user     : 'db_schulprj_user',
  	password : '20fj%iQ7',
  	database : 'DB_SchulPrj'
});

connection.connect(function(err) {
  	if (err) {
    	console.error('Error while connecting to database: ' + err.stack);
    	return;
  	}

  	console.log('Successfully connected to database as ' + connection.threadId);
});
//Database



client.once('ready', () => {
	client.user.setActivity(`${prefix}help`, {type: "playing"});

	console.log('Ready!');
});
client.once('reconnecting', () => {
	console.log('Reconnecting!');
});
client.once('disconnect', () => {
	console.log('Disconnect!');
});


client.on('guildMemberAdd', member => {
  	member.addRole('guest');
}

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	if (message.content.toLowerCase().startsWith(`${prefix}ping`)) {
		const m = await message.channel.send(`Pong!`);
		m.edit(`Pong! My latency is ${m.createdTimestamp - message.createdTimestamp}ms!`);
		return;
	} else if (message.content.toLowerCase().startsWith(`${prefix}list`)) {
		listUsers(message, connection);
		return;
	} else if (message.content.toLowerCase().startsWith(`${prefix}help`)) {
		help(message, connection);
		return;
	} else {
		message.channel.send('You need to enter a valid command!')
	}
});

function help(message, connection) {
	var embed = new Discord.MessageEmbed()
		.setColor('#00c600')
		.setTitle('Help')
		.setAuthor('Eligored', client.user.avatarURL)
		.addFields(
			{ name: `Help`, value: 'List of all bot commands' },
			{ name: '\u200B', value: '\u200B' },
			{ name: `${prefix}help`, value: 'List all commands' },
			{ name: `${prefix}ping`, value: 'Returns bot`s latency' },
			{ name: `${prefix}list`, value: 'List all registered users' },
		)
		.setTimestamp()
		.setFooter(message.author.username, message.author.displayAvatarURL);

	message.channel.send(embed);
}

function listUsers(message, connection) {
	var embed = new Discord.MessageEmbed()
		.setColor('#00c600')
		.setTitle('Userlist')
		.setAuthor('Eligored', client.user.avatarURL)
		.addFields(
			{ name: 'Userlist', value: 'Lists  all registered users' },
			{ name: '\u200B', value: '\u200B' },
		)
		.setTimestamp()
		.setFooter(message.author.username, message.author.displayAvatarURL);

		connection.query('SELECT * FROM `Favo_Eligored_users`', function (error, results, fields) {
			results.forEach(user => {
				embed.addField(`${user.name}`, `${user.email}`)
			});
			message.channel.send(embed);
		});
}

client.login(token);
