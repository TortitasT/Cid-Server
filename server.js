const { Server } = require("socket.io");
const stdin = process.openStdin();
const Chalk = require("chalk");
const Player = require("./classes/player.js");
const Vector2 = require("./classes/vector2.js");

// Socket io configuration
const io = new Server();

// Multiple configs
const configs = {
  port: process.env.PORT || 28962,
  players: [],
  log: Chalk.blue("Start of log\n"),
};

function print(text) {
  configs.log += text;
  console.log(text);
}

// Gets a player from the above list
function getPlayer(id) {
  for (let i = 0; i < configs.players.length; i++) {
    if (configs.players[i].id === id) {
      return configs.players[i];
    }
  }
}

// Connection logic
io.on("connection", (socket) => {
  // Add player to the list of players
  print(
    Chalk.cyan(
      `Player ${socket.id} connected from ip: ${socket.request.remoteAddress}\n`
    )
  );

  // Recieve player character information
  socket.on("config", (response) => {
    newPlayer = new Player(response);
    configs.players.push(newPlayer);

    // Send the current players to the new player and tell the rest that a new player has joined
    socket.emit("currentPlayers", { players: configs.players });
    socket.broadcast.emit("registered", { player: newPlayer });
  });

  // Update on tick
  socket.on("update", (response) => {
    const player = getPlayer(socket.id);

    if (player) { // If the player is initialized
      const distance = Vector2.distance(player?.pos, response.pos);

      if (distance <= 1 && distance > 0) {
        // Check if player has moved an acceptable ammount
        player.pos = response.pos;
        socket.broadcast.emit("updated", { id: player.id, pos: player.pos });
      } else {
        // Kick player??
      }
    }
  });

  // Manage disconnection of players
  socket.on("disconnect", () => {
    configs.players.splice(configs.players.indexOf(getPlayer(socket.id)), 1);
    print(Chalk.yellow(`Player ${socket.id} disconnected \n`));

    socket.broadcast.emit("disconnected", { id: socket.id });
  });
});

// Commands definitions
const input = require("./classes/commands.js");

// Listen for commands
stdin.addListener("data", function (d) {
  input(d.toString().trim().toLowerCase(), configs);
});

// Listen port
io.listen(configs.port);
