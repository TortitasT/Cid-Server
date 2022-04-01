const { Server } = require("socket.io");
const stdin = process.openStdin();
const Chalk = require("chalk");
const Player = require("./classes/player.js");

// Socket io configuration
const port = process.env.PORT || 28962;
const io = new Server();

// List of players connected and their info
let players = [];

// Log of events
let log = "";

function print(text) {
  log += text;
  console.log(text);
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
  print(
    Chalk.cyan(
      `Player ${socket.id} connected from ip: ${socket.request.remoteAddress}\n`
    )
  );

  // Recieve player character information
  socket.on("config", (response) => {
    newPlayer = new Player(response);
    players.push(newPlayer);

    // Send the current players to the new player and tell the rest that a new player has joined
    socket.emit("currentPlayers", { players: players });
    socket.broadcast.emit("registered", { player: newPlayer });
  });

  // Update on tick
  socket.on("update", (response) => {
    const player = getPlayer(socket.id);
    if (player) {
      player.pos = response.pos;
      socket.broadcast.emit("updated", { id: player.id, pos: player.pos });
    }
  });

  // Manage disconnection of players
  socket.on("disconnect", () => {
    players.splice(players.indexOf(getPlayer(socket.id)), 1);
    print(Chalk.yellow(`Player ${socket.id} disconnected \n`));

    socket.broadcast.emit("disconnected", { id: socket.id });
  });
});

// Commands definitions
function input(command) {
  switch (command) {
    case "quit":
      process.exit();
    case "status":
      console.log(`\n`);
      console.log(Chalk.green(`Server running on port: ${port}`));
      console.log(Chalk.blue(`Players (${players.length}):`));
      console.log(`\n`);
      for (let i = 0; i < players.length; i++) {
        console.log(`id: ${players[i].id}`);
        console.log(`name: ${players[i].character.name}`);
        console.log(`level: ${players[i].character.level}`);
        console.log(`pos: ${players[i].pos.x}, ${players[i].pos.y}`);
        console.log(`\n`);
      }
      break;
    case "help":
      console.log(`\n`);
      console.log("Commands available:");
      console.log("- help");
      console.log("- quit");
      console.log("- status");
      console.log(`\n`);
      break;
    case "log":
      console.log(`\n`);
      console.log(log);
      break;
    case "clear":
      console.clear();
  }
}

// Listen for commands
stdin.addListener("data", function (d) {
  input(d.toString().trim().toLowerCase());
});

// Listen port
io.listen(port);
