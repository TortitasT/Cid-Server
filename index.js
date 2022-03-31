const { Server } = require("socket.io");

// Socket io configuration
const port = process.env.PORT || 28962;
const io = new Server();

// List of players connected and their info
let players = [];
class Player {
  constructor(id) {
    this.id = id;
  }
}
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
  players.push(new Player(socket.id, "noname"));
  console.log(
    `Player ${socket.id} connected from ip: ${socket.request.remoteAddress}`
  );

  // Recieve player character information
  socket.on("config", (character) => {
    getPlayer(socket.id).character = character;
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
    console.log(`pos: ${players[i].character.pos.x}, ${players[i].character.pos.y}`);
    console.log(`\n`)
  }
}, 500);

// Listen port
io.listen(port);
