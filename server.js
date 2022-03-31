const { Server } = require("socket.io");
const Player = require("./classes/player.js");

// Socket io configuration
const port = process.env.PORT || 28962;
const io = new Server();

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

// Connection logic
io.on("connection", (socket) => {
  // Add player to the list of players
  console.log(
    `Player ${socket.id} connected from ip: ${socket.request.remoteAddress}`
  );

  // Recieve player character information
  socket.on("config", (response) => {
    players.push(new Player(socket.id, response.character, response.pos));

    socket.emit("registered", {
      id: socket.id,
      character: response.character,
      pos: response.pos,
    });
  });

  // Update on tick
  socket.on("update", (response) => {
    const player = getPlayer(socket.id);
    if (player) {
      player.pos = response.pos;
      socket.emit("updated", { id: player.id, pos: player.pos });
    }
  });

  // Manage disconnection of players
  socket.on("disconnect", () => {
    players.splice(players.indexOf(getPlayer(socket.id)), 1);
    console.log(`Player ${socket.id} disconnected`);
  });
});

// Debug players
setInterval(() => {
  console.clear();
  console.log(`Status: \n`);
  for (let i = 0; i < players.length; i++) {
    console.log(`id: ${players[i].id}`);
    console.log(`name: ${players[i].character.name}`);
    console.log(`level: ${players[i].character.level}`);
    console.log(`pos: ${players[i].pos.x}, ${players[i].pos.y}`);
    console.log(`\n`);
  }
}, 500);

// Listen port
io.listen(port);
