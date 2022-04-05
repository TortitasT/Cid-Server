const { io } = require("socket.io-client");
const prompt = require("prompt-sync")();
const ip = process.env.IP || "localhost";
const port = process.env.PORT || 28962;

const character = {
  name: prompt("Character name: "),
  level: prompt("Character level: "),
};
const pos = {
  x: 0,
  y: 0,
};
let id = 0;

// List of players connected and their info
let players = [];

// Gets a player from the above list
function getPlayer(id) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
}

const socket = io(`ws://${ip}:${port}/`);

console.log(`Trying to connect to ${ip}:${port}`);

socket.on("connect", () => {
  console.clear();
  console.log("Connected as:");
  console.log(socket.id);

  id = socket.id;
  socket.emit("config", { id: socket.id, character: character, pos: pos });

  // Walk mock
  setTimeout(() => {
    setInterval(() => {
      pos.x++;
      socket.emit("update", { pos: pos });
    }, 1000);
  }, 500);

  socket.on("currentPlayers", (response) => {
    players = response.players;

    console.log(players);
  });

  socket.on("registered", (response) => {
    players.push(response.player);
    console.log(`Player ${response.player.character.name} connected`);

    console.log(players);
  });

  socket.on("updated", (response) => {
    getPlayer(response.id).pos = response.pos;
  });

  socket.on("disconnected", (response) => {
    // console.log(`Updated user: ${response.id}`);
    players.splice(players.indexOf(getPlayer(response.id)), 1);

    console.log(`Player ${response.name} disconnected`);
    console.log(players);
  });

  socket.on("connect_error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });
});

setInterval(() => {
  for (let i = 0; i < players.length; i++) {
    console.log(`id: ${players[i].id}`);
    console.log(`name: ${players[i].character.name}`);
    console.log(`level: ${players[i].character.level}`);
    console.log(`pos: ${players[i].pos.x}, ${players[i].pos.y}`);
    console.log(`\n`);
  }
}, 1000);
