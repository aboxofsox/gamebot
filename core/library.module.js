//module to help with creating a game library
const db = require('./db.module.js'),
api = require('./api.module.js');

module.exports = {
    add: async (username, query) =>{
        let data = await db.fetchLib(username);        
        let library = data.library;
        const res = await api.search(query);


        const game = {
            title: res.results[0].name,
            image: res.results[0].image.small_url
        };

        const included = (library => library.title.includes(game.title));
        const gameExist = library.some(included);

        if(gameExist){
            console.log('game already exist');
        }else {
            console.log('adding game library');
            library.push(game);
            db.lib(username, library);
        }      
    },
    share: async (username) =>{
        let data = await db.fetchLib(username);
        let library = data.library;

        return library;
    },
    remove: async (username, query) =>{
        let data = await db.fetchLib(username);
        let library = data.library;
        const res = await api.search(query);

        const title = res.results[0].name;

        for(let i = 0; i < library.length; i++) {
            if(library[i].title.indexOf(title) >= 0) {
                library.splice(i, 1);
            }
        }

        db.lib(username, library);

    }
}