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

// Prints text on screen and logs it
function print(text) {
  const currentDate = new Date();

  configs.log += `[${Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    currentDate.getDay()
  )} ${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}] ${text}\n`;
  console.log(text);
}

// Gets a player from the db
function getPlayer(id) {
  for (let i = 0; i < configs.players.length; i++) {
    if (configs.players[i].id === id) {
      return configs.players[i];
    }
  }
}

// Connection logic
io.on("connection", (socket) => {
  // Recieve player character information
  socket.on("config", (response) => {
    newPlayer = new Player(response);
    print(
      Chalk.cyan(
        `Player ${newPlayer.character.name} (${socket.id}) connected from ip: ${socket.conn.remoteAddress}`
      )
    );

    // Send the current players to the new player and tell the rest that a new player has joined
    socket.emit("currentPlayers", { players: configs.players });
    socket.broadcast.emit("registered", { player: newPlayer });

    // Add player to db
    configs.players.push(newPlayer);
  });

  // Update on tick
  socket.on("update", (response) => {
    const player = getPlayer(socket.id);

    if (player) {
      const distance = Vector2.distance(player?.pos, response.pos);

      // Check if player has moved an acceptable amount
      if (distance <= 1 && distance > 0) {
        player.pos = response.pos;
        socket.broadcast.emit("updated", { id: player.id, pos: player.pos });
      } else {
        // Kick player??
      }
    }
  });

  // Manage disconnection of players
  socket.on("disconnect", () => {
    const name = getPlayer(socket.id)?.character.name || "Unknown";
    configs.players.splice(configs.players.indexOf(getPlayer(socket.id)), 1);
    print(Chalk.yellow(`Player ${name} (${socket.id}) disconnected`));

    socket.broadcast.emit("disconnected", { id: socket.id, name: name });
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
