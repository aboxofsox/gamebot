const api = require('./api.module.js');

module.exports = {
    draw: () =>{
        const questions = api.quiz();
        const rand = Math.floor(Math.randomd() * questions.results.length);

        console.log(questions.results[rand]);
    }
}