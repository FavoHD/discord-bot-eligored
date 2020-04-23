const Discord = require('discord.js');
const client = new Discord.Client();

try {
	const {
		prefix,
		token,
		ownerId,
		host,
		user,
		password,
		database,
	} = require('./conf.json');
} catch (e) {}

const prefix = process.env.prefix || prefix;
const token = process.env.token || token;
const ownerId = process.env.ownerId || ownerId;


//Database
var mysql = require('mysql');
var connection = mysql.createConnection({
  	host     : process.env.host || host,
  	user     : process.env.user || user,
  	password : process.env.password || password,
  	database : process.env.database || database
});

connection.connect(function(err) {
  	if (err) {
    	console.error('Error while connecting to database: ' + err.stack);
	    return;
	}

	console.log('Successfully connected to database as ' + connection.threadId);
});
//Database

var Password = require("node-php-password");



client.once('ready', () => {
	client.user.setActivity(`${prefix}help`);

	console.log('Ready!');
});
client.once('reconnecting', () => {
	console.log('Reconnecting!');
});
client.once('disconnect', () => {
	console.log('Disconnect!');
});


client.on('guildMemberAdd', member => {
	const role = member.guild.roles.cache.find(role => role.name === "guest");
	if (!role) return;
	try {
		member.roles.add(role);
	} catch(err) {
		console.log("guildMemberAdd event: "+err);
	}

  	const channel = member.guild.channels.cache.find(ch => ch.name === '👋willkommen👋');
  	if (!channel) return;
  	channel.send(`Welcome to the server, ${member}`);

	member.send(`Hier können sie sich in ihren Eligored Profil für den Eligored Discord Server einlogen mit: ${prefix}login <email> <password>`)
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	if (message.guild == null) {
		if (message.content.toLowerCase().startsWith(`${prefix}help`)) {
			helpDm(message, connection);
			return;
		} else if (message.content.toLowerCase().startsWith(`${prefix}login`)) {
			login(message, connection);
			return;
		} else {
			message.channel.send('You need to enter a valid command!')
		}
	} else {
		if (message.content.toLowerCase().startsWith(`${prefix}ping`)) {
			const m = await message.channel.send(`Pong!`);
			m.edit(`Pong! My latency is ${m.createdTimestamp - message.createdTimestamp}ms!`);
			return;
		} else if (message.content.toLowerCase().startsWith(`${prefix}help`)) {
			helpGuild(message, connection);
			return;
		} else if (message.content.toLowerCase().startsWith(`${prefix}list`)) {
			listUsers(message, connection);
			return;
		} else {
			message.channel.send('You need to enter a valid command!')
		}
	}
});

function helpGuild(message, connection) {
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

		var sql_query = `SELECT * FROM Favo_Eligored_users`;

		connection.query(sql_query, function (error, results, fields) {
			if (error) {
				console.log("login function: "+error);
				return;
			}

			results.forEach(user => {
				embed.addField(`${user.name}`, `${user.email}`)
			});
			message.channel.send(embed);
		});
}

function helpDm(message, connection) {
	message.channel.send("helpDM");
}

function login(message, connection) {
	const args = message.content.split(" ");
	if((!args[1]) || (!args[2])) return;
	const email = args[1];
	const password = args[2];

	var sql_query = `SELECT * FROM Favo_Eligored_users WHERE email = "${email}"`;

	connection.query(sql_query, function (error, result, fields) {
		if (error) {
			console.log("login function: "+error);
			return;
		}

		if(Password.verify(password, result[0].password)){
			message.channel.send("Correct password");

			var sql_query = `INSERT INTO Favo_Eligored_user_discord (user_id, discord_id) VALUES ("${result[0].id}", "${message.author.id}");`;

			connection.query(sql_query, function (error, result, fields) {
				if (error) {
					console.log("login function: "+error);
					return;
				}
			});
		} else {
			message.channel.send("Incorrect password");
		}
	});
}

client.login(token);
