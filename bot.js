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

const PasswordVerify = new (require('password-verify'))();



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
			console.log("listUsers function: "+results);

			results.forEach(user => {
				embed.addField(`${user.name}`, `${user.email}`)
			});
			message.channel.send(embed);
		});
}

function helpDm(message, connection) {
	console.log("helpDM");
}

function login(message, connection) {
	const args = message.content.split(" ");
	if((!args[1]) || (!args[2])) return;
	const email = args[1];
	const password = args[2];

	var sql_query = `SELECT * FROM Favo_Eligored_users WHERE email = "${email}"`;

	connection.query(sql_query, function (error, result, fields) {
		console.log("login function: "+result);

		console.log(password+" "+result[0].password);
		//console.log(PasswordVerify.verifyPassword(password, result.password));
	});
}

client.login(token);
