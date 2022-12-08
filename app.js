const express = require("express");

const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbpath,
            driver: sqlite3.Database,
        });
        app.listen(3001, () => {
            console.log("Server is running at http://localhost:3001/players/");
        });
    } catch (e) {
        console.log(`DB Error:${e.message}`);
        process.exit(1);
    }
};
initializeDBAndServer();

app.get("/players/", async (request, response) => {
    const getPlayersQuery = `
    SELECT *
    FROM cricket_team
    ORDER BY player_id;`;
    const playerArray = await db.all(getPlayersQuery);
    response.send(playerArray);
});

app.post("/players/", async (request, response) => {
    const playerDetails = request.body;
    const { playerId, playerName, jerseyNumber, role } = playerDetails;
    const addPlayerQuery = `
    INSERT INTO
    cricket_team (playerId,playerName,jerseyNumber,role)
    VALUES(
        ${playerId},
        '${playerName}',
        ${jerseyNumber},
        '${role}'
    ) `;
    const addPlayer = await db.run(addPlayerQuery);
    response.send("player added to team");
});
app.get("/players/:playerId", async (request, response) => {
    const { playerId } = request.params;
    const playerDetails = request.body;

    const getPlayerQuery = `
    SELECT *
    FROM cricket_team
    where playerId=${playerId};`;
    const getplayerDetails = await db.get(getPlayerQuery);

    respond.send(playerDetails.playerId);

})

app.put("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const playerDetails = request.body;

    const updatePlayerQuery = `
    UPDATE
    cricket_team 
    SET(
       player_id= ${playerId},
       player_name='${playerName}',
       jersey_number=${jerseyNumber},
       role='${role}'
    ) `;
    const updatePlayer = await db.run(updatePlayerQuery);

    response.send(cricket_team.playerId);
});

module.exports = app;