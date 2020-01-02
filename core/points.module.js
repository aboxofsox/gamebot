const db = require('./db.module.js');

module.exports = {
    add: (username, point) =>{
        let points = db.fetchPoints(username);
        points += point;
        console.log(`Points before update: ${points}`);
        db.updatePoints(username, point);
    },
    leaderboard: (users) =>{},
    check: async (username) =>{
        const points = await db.fetchPoints(username);
        return points;
    }
}