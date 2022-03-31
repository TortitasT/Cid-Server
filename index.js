const port = process.env.PORT || 28962
const io = require('socket.io')(port)

console.log(`Server listening on port ${port}`)