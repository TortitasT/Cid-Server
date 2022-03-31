const {Server} = require('socket.io')

const port = process.env.PORT || 28962

const io = new Server()

io.on('connection', (socket) => {
  const client = socket.handshake.address
  console.log(`Player connected from ip: ${client.address}:${client.port}`)
})
io.on('disconnect', () => {
  console.log(`Player disconnected`)
})
io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`)
})

io.listen(port)
