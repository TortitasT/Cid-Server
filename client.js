const { io } = require("socket.io-client");
const port = process.env.PORT || 28962;

const socket = io(`ws://127.0.0.1:${port}`);

const character = {
  name: 'Cid',
  level: '15',
  pos: {
    x: 0,
    y: 0,
  },
}

socket.on("connect", () => {
  console.log("Connected as:");
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx

  socket.emit("config", character);

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});
