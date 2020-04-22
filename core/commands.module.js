const api = require('./api.module.js'),
db = require('./db.module.js'),
lib = require('./library.module.js'),
trivia = require('./trivia.module.js'),
trivia2 = require('./new.trivia.js');

const colors = [
    'f5ad42',
    '42f55d',
    '42d1f5',
    '6942f5',
    'f542dd',
    'f5427e',
    'ff6b6b',
    '6bffc9'
];

const randColors = (colors) =>{
    const rand = Math.floor(Math.random() * colors.length);

    return colors[rand];
}
// Variables for trivia
const questions = require('./questions.json');
let unusedQuestions = [...questions];

module.exports = {
    command: async (client, msg, prefix, RichEmbed) =>{
        if(msg.content.indexOf(prefix) !== 0) return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if(command === 'gb') {
            const color = randColors(colors);
            
            const query = args.join(' ');
            const game = await api.search(query);

            const developers = await api.developers(game.results[0].guid);
            const review = `${developers.results.reviews ? developers.results.reviews[0].site_detail_url : 'Not Available'}`;

            const embed = new RichEmbed()
                .setTitle(game.results[0].name)
                .setColor(color)
                .setDescription(game.results[0].deck)
                .setImage(game.results[0].image.small_url)
                .addField('Developer', developers.results.developers[0].name, true)
                .addField('Publisher', developers.results.publishers[0].name, true)
                .addBlankField()
                .addField('User Reviews', developers.results.number_of_user_reviews, true)
                .addField('GiantBomb Review', review, true);
            msg.channel.send(embed).then(message =>{
                message.react('👍')
                    .then(() => message.react('👎'))
                    .then(() => message.react('💖'))
                    .then(() => message.react('😠'))
                    .catch(() => console.log('Reaction Error'));
            });
        }
        if(command === 'gbr') {
            const color = randColors(colors);
            const query = args.join(' ');
            const rawg = await api.gmrev(query);
            const embed = new RichEmbed()
                .setTitle(rawg.results[0].name)
                .setColor(color)
                .setImage(rawg.results[0].background_image)
                .addField('Review Count', rawg.results[0].reviews_count, true)
                .addField('Score', Math.round(rawg.results[0].score), true)
                .addField('Rating', `${rawg.results[0].rating}/5`, true);
            msg.channel.send(embed);
           
        }
        if(command === 'gbhelp' || command === 'gbh') {
            const color = randColors(colors);
            const embed = new RichEmbed()
                .setTitle('Game Bot Commands')
                .setColor(color)
                .setDescription('Quickly search a few databases to find everything you need to know about a specific video game.')
                .addField('General Information', '!gb [query]', true)
                .addField('Reviews & Ratings', '!gbr [query]', true)
                .addField('Clips & Videos', '!gbv [query]', true)
                .addField('Create Library', '!gb-create', true)
                .addField('Add to Library', '!gb-add [query]', true)
                .addField('Remove from Library', '!gb-remove', true)
                .addField('Share Library', '!gb-share', true)
                .addField('Trivia!', '!gb-trivia', true);
            msg.channel.send(embed);
        }

        if(command === 'gb-create') {
            const user = msg.author.username;
            console.log(`${user} sent a message.`);

            msg.channel.send('You have been added to the database. Use !gb-add to add a game.');

            db.save(user);
        }
        if(command === 'gb-add') {
            console.log(`Adding game.`);

            const query = args.join(' ');

            lib.add(msg.author.username, query);
            msg.channel.send(`${query.toUpperCase()} has been added to your library.`);
        }

        if(command === 'gb-remove') {
            console.log('Removing game...');

            const query = args.join(' ');

            lib.remove(msg.author.username, query);
            msg.channel.send(`${query.toUpperCase()} has been removed from your library.`);
        }

        if(command === 'gb-share') {
            const library = await lib.share(msg.author.username);
            const username = encodeURIComponent(msg.author.username);

            const games = [];

            library.forEach(e => games.push(e.title));

            const list = games.splice(0,5);

            const embed = new RichEmbed()
                .setTitle(`${msg.author.username}'s Library`)
                .setColor(randColors(colors))
                .addField(`Games`, list.join('\n'), true)
                .addField('See More', `https://dscrd-gm-bot.herokuapp.com/user?username=${username}`, false);
           
            msg.channel.send(embed);
        }        

        if(command === 'gb-trivia') {
            const rand = Math.floor(Math.random() * unusedQuestions.length);
            const item = unusedQuestions[rand];
            unusedQuestions.splice(rand, 1); // remove used question
            if(unusedQuestions.length === 0){
                unusedQuestions = [...questions];
            }
            console.log(unusedQuestions);
            const filter = response => {
                return item.answers.toLowerCase() === response.content.toLowerCase();
            }

            msg.channel.send(item.question).then(() =>{
                console.log(filter);
                msg.channel.awaitMessages(filter, {maxMatches: 1, time: 30000, errors: ['time']})
                    .then(collected =>{
                        msg.channel.send(`${collected.first().author} got the right answer!`);
                    })
                    .catch(collected =>{
                        msg.channel.send('Looks like nobody got the answer right');
                    });
            });
        }

        if(command === 'gb-trivia2') {
            const question = await api.trivia2.draw();
            const filter = response =>{
                return question.a.toLowerCase() === response.content.toLowerCase();
            }
            msg.channel.awaitMessage(filter, {maxMathes: 1, time: 30000, errors: ['time']})
                .then(collected =>{
                    msg.channel.send(`${collected.first().author} got the right answer!`);
                })
                .catch(collected =>{
                    msg.channel.send('Looks like nobody got the answer right.');
                });
        }
    }
        
}