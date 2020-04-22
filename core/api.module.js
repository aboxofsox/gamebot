const fetch = require('node-fetch'),
fs = require('fs');

module.exports = {
    search: async (query) =>{
        const url = `https://www.giantbomb.com/api/search/`;
        const key = process.env.GIANTBOMB;

        const res = await fetch(`${url}?api_key=${key}&format=json&query=${query}&resources=game`);
        const json = await res.json();

        return json;
    },
    developers: async (query) =>{
        const url = `https://www.giantbomb.com/api/game/`;
        const key = process.env.GIANTBOMB;

        const res = await fetch(`${url}${query}/?api_key=${key}&format=json&fields=developers,publishers`);
        const json = await res.json();

        return json;
    },
    gmrev: async (query) =>{
        const url = `https://api.rawg.io/api/games?search=${query}`;

        const res = await fetch(url, {});
        const json = await res.json();

        return json;
        
    },
    quiz: async () =>{
        const url = `https://opentdb.com/api.php?amount=50&category=15&difficulty=easy&type=multiple`;
        const res = await fetch(url);
        const json = await res.json();

        return json;
    }
}