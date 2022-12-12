const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbpath = path.join(__dirname, "cricketTeam.db");

const app = express();
app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT *
    FROM cricket_team`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getPlayerQuery = `
    SELECT *
    FROM cricket_team
    where playerId=${playerId};`;
  const getplayerDetails = await db.get(getPlayerQuery);

  respond.send(convertDbObjectToResponseObject(player));
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId, playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO
    cricket_team (player_name,jersey_number,role)
    VALUES(
          
        '${playerName}',
        ${jerseyNumber},
        '${role}'
    ) `;
  const addPlayer = await db.run(addPlayerQuery);
  response.send("player added to team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;

  const updatePlayerQuery = `
    UPDATE
    cricket_team 
    SET(
       
       player_name='${playerName}',
       jersey_number=${jerseyNumber},
       role='${role}'
    WHERE  player_id=${playerId}; `;
  await db.run(updatePlayerQuery);

  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePlayerQuery = `
    
    DELETE FROM cricket_team
    WHERE player_id=${playerId} `;
  await db.run(deletePlayerQuery);

  respond.send("Player Removed");
});

module.exports = app;
