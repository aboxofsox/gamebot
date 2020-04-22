const api = require('./api.module.js');

module.exports = {
    draw: async () =>{
        const questions = await api.quiz();
        const rand = Math.floor(Math.random() * questions.results.length);

        const question = {
            q: questions.results[rand].question,
            a: questions.results[rand].correct_answer,
        }

        console.log(question);

        
    }
}