const db = require('./db.module.js');

module.exports = {
    add: (username, point) =>{
        const points = db.fetchPoints(username);
        points += point;
        db.updatePoints(username, point);
    },
    leaderboard: (users) =>{},
    check: (username) =>{
        const points = db.fetchPoints(username);
        return points;
    }
}