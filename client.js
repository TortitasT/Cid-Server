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

const socket = io(`ws://${ip}:${port}`);

console.log(`Trying to connect to ${ip}:${port}`);

socket.on("connect", () => {
  console.clear();
  console.log("Connected as:");
  console.log(socket.id);

  socket.emit("config", { character: character, pos: pos });

  setTimeout(() => {
    setInterval(() => {
      pos.x++;
      socket.emit("update", { pos: pos });
    }, 50);
  }, 500);

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});
