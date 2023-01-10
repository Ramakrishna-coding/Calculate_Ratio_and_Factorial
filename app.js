const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

/* get player details      #############################################
###################################################################
################################################################*/

app.get("/players/", async (request, response) => {
  const getPlayerDetailsQuery = `
    SELECT 
      * 
    FROM 
      cricket_team;
    ORDER BY
      player_id;
    `;
  const getDetails = await db.all(getPlayerDetailsQuery);
  response.send(getDetails);
});

/* create a player      #############################################
###################################################################
################################################################*/

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO cricket_team
      (player_name, jersey_number, role)
    VALUES
      ('${playerName}', ${jerseyNumber}, '${role}');
  `;

  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

/* select one player      #############################################
###################################################################
################################################################*/

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT 
      * 
    FROM 
      cricket_team 
    WHERE 
      player_id = ${playerId};
  `;
  const getPlayer = await db.get(getPlayerQuery);
  response.send(getPlayer);
});

/* update a player      #############################################
###################################################################
################################################################*/

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE
        cricket_team
    SET
        player_name='${playerName}',
        jersey_number=${jerseyNumber},
        role='${role}'
    WHERE
      player_id = ${playerId};
    `;
  const updatePlayer = await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

/* delete a player      #############################################
###################################################################
################################################################*/

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM 
      cricket_team 
    WHERE 
      player_id = ${playerId};
    `;
  const deletePlayer = await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
