const lobbies = {};

module.exports = {
    create: (name, owner, max = 4) =>{
        lobbies[name] = {
            owner: owner,
            max: max,
            players: [],
            lfg: true,
        }
    },
    join: (lobby, player) =>{
        const lobbyNames = Object.keys(lobbies);
        lobbyNames.forEach(name =>{
            if(name === lobby) {
                lobbies[name].players.push(player);
                return true;
            } else {
                return false;
            }
        });
    },
    open: (lobby) =>{
        lobbies[lobby].lfg = true;
    },
    destroy: (lobby, owner) => {
        if(lobbies[lobby].owner === owner) {
            delete lobbies[lobby];
            return true;
        } else {
            return false;
        }
    },
    list: () =>{
        return lobbies;
    }
}