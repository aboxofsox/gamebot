const {Client, RichEmbed} = require('discord.js'),
client = new Client(),
fs = require('fs'),
prefix = process.env.PREFIX,
api = require('./core/api.module.js'),
express = require('express'), //used for the fancy redirect
app = express(),
cmd = require('./core/commands.module.js'),
utlity = require('./utliity/awken.module.js'),
db = require('./core/db.module.js'),
bodyParser = require('body-parser'),
pnt = require('./core/points.module.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(express.static('user'));

app.get('/', async (req, res) =>{
    res.sendFile(`${__dirname}/index.html`);
});
app.get('/user', async (req, res) =>{
    res.sendFile(`${__dirname}/user/library.html`);
    const username = req.query.username;

    console.log(username);
});
app.get('/query', async (req, res) =>{
    const username = decodeURIComponent(req.query.username);
    const data = await db.fetchLib(username);

    res.json(data);

});

client.on('ready', () =>{
    console.log(`Logged on as ${client.user.tag}`);
})

client.on('message', async msg =>{
    pnt.add(msg.author.username, 1);
    cmd.command(client, msg, prefix, RichEmbed);


    if(msg.embeds > 0) {
        msg.react('👍')
            .then(() => msg.react('👎'))
            .then(() =>{msg.react('👌')})
            .catch(() => console.log('Emoji failure'));
    }
    
});
async function buildLib(res, username) {
    const data = await db.fetchLib(username);
    res.send(data);

}

client.on('guildMemberAdd', member =>{
    console.log(`${member.user.username} has joined.`)
});
client.login(process.env.TOKEN);

app.listen(process.env.PORT || 3000, (err) =>{
    if(err) console.log(err);
    console.log(`|Server Started|`);
});

//bypass herokus shitty policy for putting apps to sleep due to inactivity
setInterval(() =>{
    utlity.keepawake();
}, 120000);