const api = require('./api.module.js');

module.exports = {
    draw: async () =>{
        const questions = await api.quiz();
        const rand = Math.floor(Math.random() * questions.results.length);

        console.log(questions.results[rand]);
    }
}